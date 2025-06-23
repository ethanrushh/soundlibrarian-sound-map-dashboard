
/*
public class AdminMapPinOutDto
{
    public long Id { get; set; }
    
    public double Longitude { get; set; }
    public double Latitude { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public string? AudioUrl { get; set; }
    public string? ArtworkUrl { get; set; }
    public DateTime DateRecordedUtc { get; set; }
    
    public PinStatus Status { get; set; } = PinStatus.PendingApproval;
}
*/

export type AdminPin = {
    id: number,

    longitude: number,
    latitude: number,

    title: string,
    description: string,
    authorName: string,
    audioUrl?: string,
    artworkUrl?: string,
    dateRecordedUtc: string,
    createdAtUtc: string,

    status: PinStatus
}

// Copied from API side
export enum PinStatus {
    PendingApproval = 0,
    Approved = 1,
    Denied = 2,
    Removed = 3
}

export function PinStatusToReadable(status: PinStatus) {
    switch (status) {
        case PinStatus.PendingApproval:
            return 'Pending Review'
        case PinStatus.Approved:
            return 'Approved'
        case PinStatus.Denied:
            return 'Denied'
        case PinStatus.Removed:
            return 'Removed'

        default:
            return 'Unknown'
    }
}
