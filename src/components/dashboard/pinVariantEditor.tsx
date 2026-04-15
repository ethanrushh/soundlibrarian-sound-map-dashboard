import { PinVariant, type AdminPin } from "@/types/api/adminTypes";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import DefaultPinIcon from '@/assets/soundmap_icon.png'
import UserPinIcon from '@/assets/soundmap_icon_orange.png'
import { LoaderCircleIcon, PencilIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import axios from "axios";
import { apiUrl } from "@/lib/utils";


export default function PinVariantEditor(props: {
    pin: AdminPin,
    setPins: React.Dispatch<React.SetStateAction<AdminPin[] | null>>,
    thisIndex: number
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [toggled, setToggled] = useState(props.pin.variant === PinVariant.User)

    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (open)
            setToggled(props.pin.variant === PinVariant.User)
    }, [open])

    async function apply() {
        setError(null)

        try {
            const userPin = toggled

            await axios.post(apiUrl() + `/dashboard/pins/${props.pin.id}/set-user`, null, {
                params: {
                    isOrange: userPin
                },
                withCredentials: true
            })

            props.setPins((pins) => {
                if (pins === null)
                    return null

                pins[props.thisIndex].variant = userPin ? PinVariant.User : PinVariant.Default
                
                return [...pins]
            })

            setOpen(false)
        }
        catch (e) {
            console.error(e)
            setError("Something went wrong trying to apply. Please try again later.")
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={open} onOpenChange={(o) => (loading && !o) ? () => {} : setOpen(o)}>
            <DialogTrigger>
                <Button variant='secondary' className="p-1">
                    <img
                        alt='Edit variant'
                        src={props.pin.variant == undefined || props.pin.variant === PinVariant.Default ? DefaultPinIcon : UserPinIcon}
                        className="h-full w-auto"
                    />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Pin Variant</DialogTitle>
                    <DialogDescription>{props.pin.title}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-row gap-4 justify-start items-center">
                    <img
                        alt='Edit variant'
                        src={toggled ? UserPinIcon : DefaultPinIcon}
                        className="h-full w-auto"
                    />
                    
                    <Label>
                        <Switch disabled={loading} checked={toggled} onCheckedChange={setToggled} />
                        User Pin
                    </Label>
                </div>

                {
                    error && <p className="text-sm text-red-800">{error}</p>
                }

                <DialogFooter>
                    <Button variant='ghost' className="flex flex-row justify-center items-center gap-2" disabled={loading}>
                        <XIcon />
                        Close
                    </Button>
                    <Button className="flex flex-row justify-center items-center gap-2" disabled={loading} onClick={apply}>
                        {
                            loading ? <LoaderCircleIcon className="animate-spin" /> : <PencilIcon />
                        }
                        Apply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
