import CategoryBadge from "@/components/dashboard/categoryBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/utils";
import type { AdminPin, ApiCategory } from "@/types/api/adminTypes";
import axios from "axios";
import { Loader, PencilIcon, PlusCircleIcon, XCircleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function CategoriesDialog(props: {
    pin: AdminPin
    setPins: React.Dispatch<React.SetStateAction<AdminPin[] | null>>
}) {
    const [pinCategories, setPinCategories] = useState<ApiCategory[] | null>(null)

    const [categories, setCategories] = useState<ApiCategory[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [applying, setApplying] = useState(false)
    const [applyError, setApplyError] = useState<string | null>(null)

    useEffect(() => {
        setPinCategories(props.pin.categories)
    }, [props.pin])

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
            setError(null)
            setApplyError(null)
        }
    }, [dialogOpen])

    async function apply() {
        try {
            setApplying(true)
            setApplyError(null)

            if (pinCategories === null)
                throw 'Not loaded yet'

            const result = await axios.post(apiUrl() + `/dashboard/pins/${props.pin.id}/edit-categories`, pinCategories.map(x => x.id), {
                withCredentials: true,
                validateStatus: () => true
            })

            if (result.status == 200) {
                setDialogOpen(false)
                props.setPins(x => [result.data, ...(x ? x.filter(y => y.id !== props.pin.id) : [])])
            }
            else {
                setApplyError(result.data || 'An unknown error occured (bad srv)')
            }
        }
        catch {
            setApplyError('An unknown error occured (no srv)')
        }
        finally {
            setApplying(false)
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={applying ? undefined : setDialogOpen}> { /* Lock out closing the dialog if we're currently waiting for API */ }
            <DialogTrigger>
                <Button variant='outline'>
                    Tags
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Tags</DialogTitle>
                    <DialogDescription>Map Pin</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-8">
                    <div>
                        <Label className="mb-1">Categories:</Label>
                        {
                            (categories === null || pinCategories === null) || (pinCategories.length + categories.length <= 0) ? (
                                <p>None</p>
                            ) : (
                                <div className="flex flex-row flex-wrap gap-2">
                                    {
                                        pinCategories.map(cat => (
                                            <Button 
                                                key={cat.id}
                                                variant='outline' 
                                                className="flex flex-row gap-1 p-2! rounded-full"
                                                onClick={() => {
                                                    setPinCategories(cats => cats?.filter(x => x.id != cat.id) ?? null)
                                                }}
                                                disabled={applying}
                                            >
                                                <CategoryBadge category={cat.name} />
                                                <XCircleIcon className="w-1 h-1 m-0 p-0" />
                                            </Button>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>

                    <div>
                        <Label className="mb-2">Available Categories:</Label>
                        {
                            <div className="flex flex-row flex-wrap gap-2">
                                {
                                    !loading && categories !== null ? (
                                        categories
                                            .filter(x => !pinCategories?.some(y => x.id === y.id))
                                            .map(cat => (
                                                <Button 
                                                    key={cat.id} 
                                                    variant='outline' 
                                                    className="flex flex-row gap-1 p-2! rounded-full"
                                                    onClick={() => {
                                                        setPinCategories(cats => cats === null ? null : [...cats, cat])
                                                    }}
                                                    disabled={applying}
                                                >
                                                    <CategoryBadge category={cat.name} />
                                                    <PlusCircleIcon className="w-1 h-1 m-0 p-0" />
                                                </Button>
                                            ))
                                    ) : (
                                        <Loader />
                                    )
                                }
                            </div>
                        }
                    </div>
                </div>
                
                { applyError && <Label className='text-xs text-red-600'>{applyError}</Label> }

                <DialogFooter className="mt-6">
                    <DialogTrigger>
                        <Button disabled={applying} className="flex flex-row gap-1 justify-center items-center" variant='secondary'>
                            <XIcon />
                            Close
                        </Button>
                    </DialogTrigger>

                    <Button onClick={apply} disabled={applying} className="flex flex-row gap-1 justify-center items-center">
                        { applying ? <Loader className="animate-spin" /> : <PencilIcon /> }
                        Apply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
