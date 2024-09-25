import { UIPanel } from './libs/ui.js';
import { APP } from './libs/app.js';

import { RapierPhysics } from 'three/addons/physics/Rapier.js';

function Player( editor ) {

	const signals = editor.signals;

	// Physics

	let physics;

	const container = new UIPanel();
	container.setId( 'player' );
	container.setPosition( 'absolute' );
	container.setDisplay( 'none' );

	//

	const player = new APP.Player();
	container.dom.appendChild( player.dom );

	window.addEventListener( 'resize', function () {

		player.setSize( container.dom.clientWidth, container.dom.clientHeight );

	} );

	signals.windowResize.add( function () {

		player.setSize( container.dom.clientWidth, container.dom.clientHeight );

	} );

	signals.startPlayer.add( function () {

		container.setDisplay( '' );

		player.load( editor.toJSON() );
		player.setSize( container.dom.clientWidth, container.dom.clientHeight );

		if ( physics !== undefined ) {
			 if (editor.project.physics.collisionShapes === true) {
				 physics.showDebug( true );
			 } else {
				 physics.showDebug( false );
			 }
		}
		player.play( physics );

	} );

	signals.stopPlayer.add( function () {

		container.setDisplay( 'none' );

		player.stop( physics );
		player.dispose();

	} );

	signals.physicsEnabled.add( async function ( enable) {
		
		if ( enable === true ) {

			physics = await RapierPhysics();
	
		}
		else {

			physics = undefined;

		}

	});

	signals.addonsUpdated.add( function () {

		let addons = {};
		const projectAddons = editor.project.addons;

		projectAddons.forEach( async (addon) => {
			
			const module = await import( addon.path );

			addons[ addon.name ] = module[ addon.name ];

		});

		player.addons = addons;

	} );

	return container;

}

export { Player };
