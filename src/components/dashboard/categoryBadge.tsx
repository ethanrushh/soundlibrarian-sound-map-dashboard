import { stringToColorHex, textColorForBackground } from "@/lib/utils"


export default function CategoryBadge(props: {
    category: string
}) {
    const color = stringToColorHex(props.category)

    return (                      
        <div className='font-bold text-xs py-1 px-2.5 rounded-full select-none' style={{
                background: color,
                color: textColorForBackground(color)
            }}>
            {props.category}
        </div>
    )
}
