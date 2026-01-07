import PinStatusBadge from "@/components/dashboard/pinStatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/utils";
import type { AdminPin } from "@/types/api/adminTypes";
import axios from "axios";
import { Loader, PencilIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";


export default function EditPinDialog(props: {
    pin: AdminPin | null, 
    open: boolean, 
    onOpenChange: (open: boolean) => void,
    setPins: React.Dispatch<React.SetStateAction<AdminPin[] | null>>
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [latitudeValue, setLatitudeValue] = useState<string>('');
    const [longitudeValue, setLongitudeValue] = useState<string>('');
    const [titleValue, setTitleValue] = useState<string>('');
    const [descriptionValue, setDescriptionValue] = useState<string>('');
    const [authorValue, setAuthorValue] = useState<string>('');
    const [recordedWithValue, setRecordedWithValue] = useState<string>('');

    useEffect(() => {
        setLatitudeValue(props.pin?.latitude?.toString() ?? '')
        setLongitudeValue(props.pin?.longitude?.toString() ?? '')
        setTitleValue(props.pin?.title ?? '')
        setDescriptionValue(props.pin?.description ?? '')
        setAuthorValue(props.pin?.authorName ?? '')
        setRecordedWithValue(props.pin?.recordedWith ?? '')
    }, [props.pin])

    async function applyEdit() {
        try {
            setLoading(true);
            setError(null);
            
            const newPin = await axios.post<AdminPin>(apiUrl() + `/dashboard/pins/${props.pin?.id ?? -1}/edit`, {
                longitude: Number.parseFloat(longitudeValue),
                latitude: Number.parseFloat(latitudeValue),
                recordedWith: recordedWithValue,
                title: titleValue,
                description: descriptionValue,
                authorName: authorValue
            }, {
                withCredentials: true
            })

            const pinToRemove = props.pin

            props.onOpenChange(false)

            if (pinToRemove === null) {
                console.warn("Pin to remove is null. A duplicate is likely to occur")
            }

            // Add new pin, remove old
            props.setPins((pins) => pins === null ? null : [newPin.data, ...pins].filter(p => p.id !== pinToRemove?.id))
        }
        catch (e) {
            console.error(e)
            setError("Something went wrong. Please check your entries and try again soon.")
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle><b>Review</b> - {props.pin?.title ?? 'Unknown Pin'}</DialogTitle>
                    <DialogDescription>Review Map Pin</DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col gap-4">
                    <div>
                        <Label className="text-muted-foreground mb-2">Position:</Label>
                        <div className="flex flex-row w-full gap-2">
                            <div className="flex-1 flex flex-col gap-1">
                                <Label className="text-muted-foreground text-xs">Latitude</Label>
                                <Input type='text' onChange={(e) => setLatitudeValue(e.target.value)} value={latitudeValue} />
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <Label className="text-muted-foreground text-xs">Longitude</Label>
                                <Input type='text' onChange={(e) => setLongitudeValue(e.target.value)} value={longitudeValue} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label className="text-muted-foreground">Title:</Label>
                        <Input type='text' onChange={(e) => setTitleValue(e.target.value)} value={titleValue} />
                    </div>

                    <div>
                        <Label className="text-muted-foreground">Description:</Label>
                        <Input type='text' onChange={(e) => setDescriptionValue(e.target.value)} value={descriptionValue} />
                    </div>

                    <div>
                        <Label className="text-muted-foreground">Author:</Label>
                        <Input type='text' onChange={(e) => setAuthorValue(e.target.value)} value={authorValue} />
                    </div>

                    <div>
                        <Label className="text-muted-foreground">Status:</Label>
                        <PinStatusBadge status={props.pin?.status ?? (-1 as any)} />
                    </div>

                    <div>
                        <Label className="text-muted-foreground">Recorded:</Label>
                        <p>{new Date(props.pin?.dateRecordedUtc ?? '00-00-0000').toLocaleDateString()}</p>
                    </div>

                    <div>
                        <Label className="text-muted-foreground">Uploaded:</Label>
                        <p>{new Date(props.pin?.createdAtUtc ?? '00-00-0000').toLocaleDateString()}</p>
                    </div>

                    <div>
                        <Label className="text-muted-foreground">Recorded With:</Label>
                        <Input type='text' onChange={(e) => setRecordedWithValue(e.target.value)} value={recordedWithValue} />
                    </div>

                    <div>
                        <Label className="text-muted-foreground mb-2">Audio Clip:</Label>
                        {
                            props.pin !== null && props.pin.audioUrl ? (
                                <audio controls className="w-full h-10">
                                    <source src={props.pin.audioUrl} />
                                </audio>
                            ) : (
                                <p>No Audio.</p>
                            )
                        }
                    </div>

                    <div>
                        <Label className="text-muted-foreground mb-2">Image:</Label>
                        {
                            props.pin !== null && props.pin.artworkUrl ? (
                                <img src={props.pin.artworkUrl} className="w-full max-w-full min-w-full min-h-30 h-30 max-h-30 object-contain" />
                            ) : (
                                <p>No Image.</p>
                            )
                        }
                    </div>
                </div>

                <hr className="my-4" />

                {
                    error !== null && (
                        <Label className="text-red-700 text-center text-xs w-full">{error}</Label>
                    )
                }

                <DialogFooter className="">
                    <Button variant='secondary' disabled={loading} onClick={() => props.onOpenChange(false)}>
                        <XIcon />
                        Cancel
                    </Button>

                    <Button disabled={loading} onClick={applyEdit}>
                        { loading ? <Loader className="animate-spin" /> : <PencilIcon /> }
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
