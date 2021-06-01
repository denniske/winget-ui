

interface Props {
    progress: number;
    width: number;
}

export default function ProgressBar(props: Props) {
    const { width, progress } = props;

    return (
        <div className="relative" style={{width: width + 'px'}}>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-500">
                <div style={{width: progress * 100 + '%'}}
                     className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500">

                </div>
            </div>
        </div>
    );
}
