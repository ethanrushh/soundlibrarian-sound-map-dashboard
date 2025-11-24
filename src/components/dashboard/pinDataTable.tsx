import { type AdminPin } from "@/types/api/adminTypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { BanIcon, CheckCircleIcon, GavelIcon, Loader, XIcon } from "lucide-react";
import { AlertDialogTitle, AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog";
import axios, { isAxiosError } from "axios";
import { apiUrl } from "@/lib/utils";
import PinStatusBadge from "./pinStatusBadge";

enum ReviewAction { Ban, Deny, Approve }

export default function PinDataTable({pins, refreshPins}: {pins: AdminPin[], refreshPins(): Promise<void>}) {

    const [reviewingPin, setReviewingPin] = useState<AdminPin | null>(null)
    const [pendingAction, setPendingAction] = useState<ReviewAction | null>(null)
    const loading = pendingAction !== null
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (reviewingPin)
            setError(null)
    }, [reviewingPin])

    async function setApprovalOnPin(action: ReviewAction) {
        if (reviewingPin === null)
            return

        setPendingAction(action)
        setError(null)

        try {
            await axios.post(apiUrl() + `/dashboard/pins/${reviewingPin.id}/review`, null, {
                withCredentials: true,
                params: {
                    action
                }
            })

            await refreshPins()
            setReviewingPin(null)
        }
        catch (e) {
            if (isAxiosError(e) && e.status === 409) {
                setError('This user is already banned')
            }
            else {
                setError('An unknown error occured while trying to perform this action. Please try again later. Logging out and back in may help.')
            }
        }
        finally {
            setPendingAction(null)
        }
    }

    return (
        <>
            <Dialog open={reviewingPin !== null} onOpenChange={o => setReviewingPin(p => o ? p : null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><b>Review</b> - {reviewingPin?.title ?? 'Unknown Pin'}</DialogTitle>
                        <DialogDescription>Review Map Pin</DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label className="text-muted-foreground">Title:</Label>
                            <h4>{reviewingPin?.title ?? 'Unknown Title'}</h4>
                        </div>

                        <div>
                            <Label className="text-muted-foreground">Description:</Label>
                            <p>{reviewingPin?.description ?? 'Unknown Description'}</p>
                        </div>

                        <div>
                            <Label className="text-muted-foreground">Author:</Label>
                            <p>{reviewingPin?.authorName ?? 'Unknown Author'}</p>
                        </div>

                        <div>
                            <Label className="text-muted-foreground">Status:</Label>
                            <PinStatusBadge status={reviewingPin?.status ?? (-1 as any)} />
                        </div>

                        <div>
                            <Label className="text-muted-foreground">Recorded:</Label>
                            <p>{new Date(reviewingPin?.dateRecordedUtc ?? '00-00-0000').toLocaleDateString()}</p>
                        </div>

                        <div>
                            <Label className="text-muted-foreground">Uploaded:</Label>
                            <p>{new Date(reviewingPin?.createdAtUtc ?? '00-00-0000').toLocaleDateString()}</p>
                        </div>

                        <div>
                            <Label className="text-muted-foreground mb-2">Audio Clip:</Label>
                            {
                                reviewingPin !== null && reviewingPin.audioUrl ? (
                                    <audio controls className="w-full h-10">
                                        <source src={reviewingPin.audioUrl} />
                                    </audio>
                                ) : (
                                    <p>No Audio.</p>
                                )
                            }
                        </div>

                        <div>
                            <Label className="text-muted-foreground mb-2">Image:</Label>
                            {
                                reviewingPin !== null && reviewingPin.artworkUrl ? (
                                    <img src={reviewingPin.artworkUrl} className="w-full max-w-full min-w-full min-h-30 h-30 max-h-30 object-contain" />
                                ) : (
                                    <p>No Image.</p>
                                )
                            }
                        </div>
                    </div>

                    <hr className="my-4" />

                    {
                        error !== null && (
                            <Label className="text-red-700">{error}</Label>
                        )
                    }

                    <DialogFooter className="">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant='destructive' disabled={loading}>
                                    <GavelIcon />
                                    Ban
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>Ban User</AlertDialogDescription>
                                </AlertDialogHeader>

                                <p>Are you absolutely sure you want to ban this IP address?</p>

                                <AlertDialogFooter>
                                    <AlertDialogTrigger asChild>
                                        <Button variant='secondary' disabled={loading}>
                                            <XIcon />
                                            Cancel
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogTrigger asChild>
                                        <Button variant='destructive' disabled={loading} onClick={() => setApprovalOnPin(ReviewAction.Ban)}>
                                            { pendingAction === ReviewAction.Ban ? <Loader className="animate-spin" /> : <GavelIcon /> }
                                            Ban
                                        </Button>
                                    </AlertDialogTrigger>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button variant='destructive' disabled={loading} onClick={() => setApprovalOnPin(ReviewAction.Deny)}>
                            { pendingAction === ReviewAction.Deny ? <Loader className="animate-spin" /> : <BanIcon /> }
                            Deny
                        </Button>

                        <Button disabled={loading} onClick={() => setApprovalOnPin(ReviewAction.Approve)}>
                            { pendingAction === ReviewAction.Approve ? <Loader className="animate-spin" /> : <CheckCircleIcon /> }
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="w-full px-10">
                <Table className="border rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>When Created</TableHead>
                            <TableHead className="text-right pr-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    {
                        pins.map((x, idx) => (
                            <TableBody key={x.id}>
                                <TableRow style={{
                                    background: idx % 2 === 0 ? '#BBB' : '#999'
                                }}>
                                    <TableCell>
                                        {idx}
                                    </TableCell>

                                    <TableCell>
                                        <PinStatusBadge status={x.status} />
                                    </TableCell>

                                    <TableCell>
                                        {x.creatorIp}
                                    </TableCell>

                                    <TableCell>
                                        {new Date(x.createdAtUtc).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell className="flex flex-row justify-end">
                                        <Button className="p-2 text-sm" variant='outline' onClick={() => setReviewingPin(x)}>
                                            Review
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ))
                    }
                </Table>
            </div>
        </>
    )
}
