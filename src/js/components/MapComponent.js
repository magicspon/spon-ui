import React, { Fragment, Component, createRef } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker
} from 'react-google-maps'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'
import { MAP } from 'react-google-maps/lib/constants'

import styles from './mapStyle'

const MapComponent = compose(
	withProps({
		googleMapURL:
			'https://maps.googleapis.com/maps/api/js?key=AIzaSyCJbpeLqDo7-r8uGAud9lFdpG6HB6iZzQY&v=3.exp&libraries=geometry,drawing',
		loadingElement: <div className="h-full" />,
		containerElement: <div className="h-full" />,
		mapElement: <div className="h-full" />
	}),
	withScriptjs,
	withGoogleMap,
	lifecycle({
		componentDidMount() {
			const {
				map: { current: map },
				markers
			} = this.props

			const newData = new google.maps.Data()

			const bounds = new window.google.maps.LatLngBounds()
			markers.forEach(({ lat, lng }) => {
				bounds.extend(new window.google.maps.LatLng(lat, lng))
			})

			map.fitBounds(bounds)

			newData.loadGeoJson('/dataLayer.json')

			newData.setMap(map.context[MAP])

			newData.setStyle({
				fillOpacity: 0,
				strokeWeight: 4,
				strokeColor: '#67E2EE'
			})
		}
	})
)(({ markers, onMarkerClick, onMarkerMouseOver, onMarkerMouseOut, map }) => (
	<GoogleMap
		ref={map}
		defaultZoom={10}
		defaultCenter={{ lat: 51.057051, lng: -0.0817164 }}
		defaultOptions={{ styles, disableDefaultUI: true }}
	>
		{markers.map(
			({
				id,
				lat,
				lng,
				color,
				title,
				isInfoBoxVisible,
				isVisible,
				isSelected
			}) => (
				<Fragment key={id}>
					{isInfoBoxVisible && (
						<InfoBox
							defaultPosition={new google.maps.LatLng(lat, lng)}
							options={{
								closeBoxURL: '',
								enableEventPropagation: true,
								pixelOffset: new google.maps.Size(0, -50),
								boxStyle: {
									overflow: 'visible'
								}
							}}
						>
							<div className="pb-0-5 relative x--50 ml-0-25">
								<div className="bg-brand text-white p-0-25 text-center text-xs-fluid whitespace-no-wrap">
									{title}
									<span className="bg-brand w-10 h-10 block rotate-45 pin-x absolute mx-auto" />
								</div>
							</div>
						</InfoBox>
					)}
					{isVisible && (
						<Marker
							position={{ lat, lng }}
							onClick={() => {
								onMarkerClick(id)
							}}
							onMouseOver={() => {
								onMarkerMouseOver(id)
							}}
							onMouseOut={() => {
								onMarkerMouseOut(id)
							}}
							icon={{
								path: 'M0,5a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
								fillColor: `rgba(${color},1)`,
								fillOpacity: 1,
								scale: isSelected ? 2 : 1,
								strokeColor: `rgba(${color},0.5)`,
								strokeWeight: 5,
								origin: new google.maps.Point(0, 0)
							}}
						/>
					)}
				</Fragment>
			)
		)}
	</GoogleMap>
))

export default class extends Component {
	map = createRef()

	render() {
		return <MapComponent {...this.props} map={this.map} />
	}
}
