import CategoryBadge from '@/components/dashboard/categoryBadge'
import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTrigger, Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiUrl, stringToColorHex } from '@/lib/utils'
import type { ApiCategory } from '@/types/api/adminTypes'
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { Loader, LoaderIcon, PlusIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/dashboard/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [categories, setCategories] = useState<ApiCategory[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newCategoryValue, setNewCategoryValue] = useState('')
  const [newCatColor, setNewCatColor] = useState('')
  const [applying, setApplying] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    setNewCatColor(stringToColorHex(newCategoryValue))
  }, [newCategoryValue])

  async function fetchCategories() {
    try {
        const pins = await axios.get<ApiCategory[]>(apiUrl() + '/dashboard/categories', {
            withCredentials: true
        })

        setCategories(pins.data)
    }
    catch {
        setError('An error occured')
    }
    finally {
        setLoading(false)
    }
  }

  useEffect(() => {
      fetchCategories()
  }, [])


  const [dialogOpen, setDialogOpen] = useState(false)
  useEffect(() => {
    if (dialogOpen === true) {
      setNewCategoryValue('')
      setAddError(null)
    }
  }, [dialogOpen])

  async function addCategory() {
    try {
      setApplying(true)
      setAddError(null)

      const result = await axios.put(apiUrl() + '/dashboard/categories', {
        name: newCategoryValue
      }, {
        withCredentials: true,
        validateStatus: () => true
      })

      if (result.status == 200) {
        setCategories(cats => [...(cats ?? []), result.data])
        setDialogOpen(false)
      }
      else {
        setAddError(result.data || 'An unknown error occured (bad srv)')
      }
    }
    catch {
      setAddError('An unknown error occured (no srv)')
    }
    finally {
      setApplying(false)
    }
  }

  return (
    <div className='w-full px-8'>
      {
        error ? (
          <Label className='text-xs text-red-600'>{error}</Label>
        ) : (
          loading ? (
            <div className='w-full flex justify-center items-center'>
                <LoaderIcon className='h-10 w-10 animate-spin' />
            </div>
          ) : (
            <>
              <h1 className='mb-4 text-xl'>Categories (tags)</h1>
              <ul className='flex flex-row flex-wrap gap-4'>
                {
                  categories && categories.map(x => 
                    <li key={x.id}>
                      <CategoryBadge category={x.name} />
                    </li>
                  )
                }
              </ul>

              <div className='w-full flex flex-row justify-center items-center mt-10'>
                <Dialog open={dialogOpen} onOpenChange={applying ? undefined : setDialogOpen}> { /* Lock out closing the dialog if we're currently waiting for API */ }
                  <DialogTrigger>
                    <Button className='flex flex-row justify-center items-center gap-1'>
                      <PlusIcon />
                      Add
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Category</DialogTitle>
                      <DialogDescription>Categories</DialogDescription>
                    </DialogHeader>

                    <div className='w-full flex flex-col gap-4'>
                      <div>
                        <Label className="text-muted-foreground mb-1">Name:</Label>
                        <div className='flex flex-row justify-center items-center gap-2 w-full'>
                            <Input disabled={applying} type='text' onChange={(e) => setNewCategoryValue(e.target.value)} value={newCategoryValue} />
                            <div className='h-4 w-4 rounded-full' style={{
                            background: newCatColor
                            }} />
                        </div>
                      </div>
                    </div>

                    { addError && <Label className='text-xs text-red-600'>{addError}</Label> }

                    <DialogFooter>
                      <DialogTrigger>
                        <Button disabled={applying} variant='secondary' className='flex flex-row justify-center items-center gap-1'>
                          <XIcon />
                          Close
                        </Button>
                      </DialogTrigger>

                      <Button disabled={applying} onClick={addCategory} className='flex flex-row justify-center items-center gap-1'>
                        { applying ? <Loader className="animate-spin" /> : <PlusIcon /> }
                        Add
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )
        )
      }
    </div>
  )
}
