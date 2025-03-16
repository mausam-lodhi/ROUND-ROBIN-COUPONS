import React from "react";

export default function Loading({ fullScreen = false }) {
	if (fullScreen) {
		return (
			<div className='loading-overlay'>
				<div className='spinner'></div>
			</div>
		);
	}

	return (
		<div className='flex justify-center p-4'>
			<div className='spinner'></div>
		</div>
	);
}
