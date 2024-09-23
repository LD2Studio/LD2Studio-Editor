import { UIPanel } from './libs/ui.js';
import { APP } from './libs/app.js';

import { RapierPhysics } from 'three/addons/physics/Rapier.js';

async function Player( editor ) {

	// Physics

	let physics;

	if ( editor.config.getKey( 'project/physics/enable' ) === true ) {

		physics = await RapierPhysics();

	}

	const signals = editor.signals;

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
			 if (editor.config.getKey( 'project/physics/collisionShapes' ) === true) {
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

	return container;

}

export { Player };
