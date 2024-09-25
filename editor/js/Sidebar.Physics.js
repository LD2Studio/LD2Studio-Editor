import * as THREE from 'three';

import { UIPanel, UIRow, UICheckbox, UIText } from './libs/ui.js';

function SidebarPhysics( editor ) {

    const strings = editor.strings;

    const signals = editor.signals;

    const container = new UIPanel();
    container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	container.setDisplay( 'none' );

    // enable

    const physicsEnableRow = new UIRow();
    const physicsEnable = new UICheckbox().onChange( update );

    physicsEnableRow.add( new UIText( strings.getKey( 'sidebar/physics/enable' ) ).setWidth( '90px' ) );
    physicsEnableRow.add( physicsEnable );

    container.add( physicsEnableRow );

    //

    function update() {

        const object = editor.selected;

        if ( object !== null ) {
            console.log( 'Physics update: ', object )

        }
    }

    function updateRows( object ) {

    }

    function updateUI( object ) {

    }

    // events

	signals.objectSelected.add( function ( object ) {

		if ( object !== null ) {
            console.log( 'Object Selected: ', object )
			container.setDisplay( 'block' );

			updateRows( object );
			updateUI( object );

		} else {

			container.setDisplay( 'none' );

		}

	} );

    signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected ) return;
        console.log( 'Object Changed: ', object )
		updateUI( object );

	} );

    signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected ) return;
        console.log( 'Refresh Sidebar: ', object )
		updateUI( object );

	} );

    return container;

}

export { SidebarPhysics };