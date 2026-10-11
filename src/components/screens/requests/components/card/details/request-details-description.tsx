import { BriefcaseBusinessIcon, GlobeIcon } from "lucide-react"
import { type FC, Fragment } from "react"

import { RequestCardDescription } from "../request-card-description"

interface Props {
	type: "geo" | "work"
	data: string[]
}

export const RequestDetailsDescription: FC<Props> = ({ type, data }) => {
	const icon = type === "geo" ? GlobeIcon : BriefcaseBusinessIcon
	const text = type === "geo" ? "География местности" : "Типы работ"

	return (
		<div className="mt-2 flex flex-wrap items-center">
			<RequestCardDescription
				className="text-on-surface inline-flex text-base"
				icon={icon}
				text={text + ":"}
			/>

			{data.map((item, index) => (
				<Fragment key={item}>
					<span className="decoration-on-surface-variant hover:text-on-surface text-on-surface-variant underline decoration-dotted underline-offset-3">
						{item}
					</span>

					{index !== data.length - 1 && <>,&nbsp;</>}
				</Fragment>
			))}
		</div>
	)
}
