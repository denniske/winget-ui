

interface Props {
    progress: number;
    width: number;
    color?: string;
}

export default function ProgressBar(props: Props) {
    const { width, progress, color = 'bg-green-500' } = props;

    return (
        <div className="relative" style={{width: width + 'px'}}>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-500">
                <div style={{width: progress * 100 + '%'}}
                     className={`${color} shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center`}>
                </div>
            </div>
        </div>
    );
}
