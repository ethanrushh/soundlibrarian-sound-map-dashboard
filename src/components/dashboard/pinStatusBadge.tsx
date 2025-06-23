import { PinStatusToReadable, PinStatus } from "@/types/api/adminTypes";
import { Badge } from "../ui/badge";


export default function PinStatusBadge({ status }: { status: PinStatus }) {
    return (
        <Badge style={pinStatusToBadgeClasses(status)}>
            {PinStatusToReadable(status)}
        </Badge>
    )
}

function pinStatusToBadgeClasses(status: PinStatus): React.CSSProperties {
    switch (status) {
        case PinStatus.Approved:
            return {
                background: '#0f6e00',
                color: 'white'
            }

        case PinStatus.Denied:
            return {
                background: '#660000',
                color: 'white'
            }

        case PinStatus.Removed:
            return {
                background: '#333',
                color: 'white'
            }

        default:
            return { }
    }
}
