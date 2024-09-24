import * as THREE from 'three';

import { UIPanel, UIRow, UIText, UICheckbox } from './libs/ui.js';

function SidebarProjectPhysics( editor ) {

    const config = editor.config;
    const strings = editor.strings;

    const container = new UIPanel();
    container.setId( 'physics' );

    const headerRow = new UIRow();
    headerRow.add( new UIText( strings.getKey( 'sidebar/project/physics' ).toUpperCase() ) );
    container.add( headerRow );

    // Enable

    const enableRow = new UIRow();
    const enable = new UICheckbox( config.getKey( 'project/physics/enable' ) )
        // .setLeft( '100px' )
        .onChange( function ( ) {
           
            config.setKey( 'project/physics/enable', this.getValue() );
            // editor.signals.configChanged.dispatch();
        }
    );

    enableRow.add( new UIText( strings.getKey( 'sidebar/project/physics/enable' ) )
        .setClass( 'Label' )
    );
    enableRow.add( enable );
    container.add( enableRow );

    // Collision shapes

    const collisionShapesRow = new UIRow();
    const collisionShapes = new UICheckbox( config.getKey( 'project/physics/collisionShapes' ) )
        // .setLeft( '100px' )
        .onChange( function ( ) {
           
            config.setKey( 'project/physics/collisionShapes', this.getValue() );
            // editor.signals.configChanged.dispatch();
        }
    );

    collisionShapesRow.add( new UIText( strings.getKey( 'sidebar/project/physics/collisionShapes' ) )
        .setClass( 'Label' )
    );
    collisionShapesRow.add( collisionShapes );
    container.add( collisionShapesRow );


    return container;

}

export { SidebarProjectPhysics };