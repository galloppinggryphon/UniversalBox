/**
 * ### Styles ###
 */
import './style.scss'

/**
 * ### Wordpress dependencies ###
 */
import { useInstanceId } from '@wordpress/compose'

/**
 *
 * @param {Object} props
 * param {*} props.block
 * @param {BlockInfoPanelCell[]} props.cells
 */
export default function BlockInfoPanel( { cells } ) {
	const instanceId = useInstanceId( BlockInfoPanel, 'BlockInfoPanel' )

	return (
		<div
			id={ `${ instanceId }` }
			className="block-info-panel"
		>
			{
				cells.map( ( cell ) => {
					const cellProps = {
						className: 'block-info-panel-cell',
						onClick: cell.onClick,
						style: cell.style,
					}

					const titleStyle = cell.style || {}

					if ( cell.bgColour ) {
						titleStyle.backgroundColor = cell.bgColour
					}

					if ( cell.colour ) {
						titleStyle.color = cell.colour
					}

					const cellBody = Array.isArray( cell.body )
						? cell.body.map( ( body, index ) => <div key={ index } className="cell-row">
							{ body }
						</div> )
						: cell.body

					return (
						<div
							key={ cell.name }
							{ ...cellProps }
						>
							<div
								className={ 'block-info-panel-cell__title' }
								style={ titleStyle }
							>
								{ cell.title }
							</div>
							<div className={ 'block-info-panel-cell__body' }>
								{ cellBody }
							</div>
							{ cell.footer &&
								<div className="block-info-panel-cell__footer">
									{ cell.footer }
								</div>
							}
						</div>
					)
				} )
			}
		</div>
	)
}
