import * as THREE from 'three';

import { UIPanel, UIRow, UICheckbox, UIText, UISelect, UINumber } from './libs/ui.js';

import { SetPhysicsCommand } from './commands/SetPhysicsCommand.js';
import { SetValueCommand } from './commands/SetValueCommand.js';

function SidebarPhysics( editor ) {

    const strings = editor.strings;

    const signals = editor.signals;

    const container = new UIPanel();
    container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	container.setDisplay( 'none' );

    // type

    const physicsTypeRow = new UIRow();
    const physicsType = new UISelect().setWidth( '150px' ).setFontSize( '12px' )
        .onChange( () => {
            // console.log( 'Physics Type: ', physicsType.getValue() );
            editor.execute( new SetPhysicsCommand( editor, editor.selected, physicsType.getValue() ) );

            updateRows( editor.selected );
            
        } );
    physicsType.setOptions( {
        'none': 'disabled',
        'fixed': 'fixed',
        'dynamic': 'dynamic',
        'kinematic_velocity': 'kinematic velocity',
        'kinematic_position': 'kinematic position'
        } ).setValue( 'none' );

    physicsTypeRow.add( new UIText( strings.getKey( 'sidebar/physics/type' ) ).setClass( 'Label' ) );
    physicsTypeRow.add( physicsType );

    container.add( physicsTypeRow );

    // mass

    const massRow = new UIRow();
    const mass = new UINumber( 1 ).setRange( 0, Infinity ).onChange( update );
    massRow.add( new UIText( strings.getKey( 'sidebar/physics/mass' ) ).setClass( 'Label' ) );
    massRow.add( mass );
    container.add( massRow );



    function update() {

        const object = editor.selected;

        if ( object !== null && editor.physics[ object.uuid ] !== undefined ) {
            // console.log( 'Physics update: ', object, object.uuid )

            if ( editor.physics[ object.uuid ].mass !== undefined ) {
                
                editor.execute( new SetValueCommand( editor, editor.physics[ object.uuid ], 'mass', mass.getValue() ) );

            }

        }
    }

    function updateRows( object ) {
        console.log( 'Update Rows: ', object, object.uuid )
        const properties = {
            'mass': massRow,
            // 'restitution': null
        };

        const physicsObject = editor.physics[ object.uuid ];

        // console.log( 'properties keys: ', Object.keys( properties ) )
        // console.log( 'properties values: ', Object.values( properties ) )
        // console.log( 'properties entries: ', Object.entries( properties ) )

        Object.keys( properties ).forEach( ( property ) => {
            // console.log( 'properties: ', property )
            const uiElement = properties[ property ];
            // console.log( 'uiElement: ', uiElement )
            uiElement.setDisplay( physicsObject[ property ] !== undefined ? '' : 'none' );
            
        })

    }


    function updateUI( object ) {
        // console.log( 'Update UI: ', object, object.uuid )
        const physics = editor.physics[ object.uuid ];

        if ( physics === undefined ) return;

        physicsType.setValue( physics.type );

        if ( physics.mass !== undefined ) {
            mass.setValue( physics.mass );
        }
          
    }

    // events

    signals.objectAdded.add( function ( object ) {
        // console.log( 'Object Added: ', object.uuid )
        if ( editor.physics[ object.uuid ] === undefined ) {
            
            editor.execute( new SetPhysicsCommand( editor, object, 'none' ) );
            
        }
        else {
            // updateRows( object );
            // updateUI( object );
        }

    } );

	signals.objectSelected.add( function ( object ) {
        
		if ( object !== null && object.type === 'Mesh' ) {
            // console.log( 'Object Selected: ', object )
			container.setDisplay( 'block' );

			updateRows( object );
			updateUI( object );

		} else {

			container.setDisplay( 'none' );

		}

	} );

    signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected ) return;
        // console.log( 'Object Changed: ', object )
		updateUI( object );

	} );

    signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected ) return;
        // console.log( 'Refresh Sidebar: ', object )
		updateUI( object );

	} );

    return container;

}

export { SidebarPhysics };