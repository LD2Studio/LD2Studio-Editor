import * as THREE from 'three';

import { UIPanel, UIRow, UIText, UICheckbox } from './libs/ui.js';

function SidebarProjectPhysics( editor ) {

    const config = editor.config;
    const signals = editor.signals;
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
           
            editor.project.physics[ 'enable' ] = this.getValue();
            signals.projectPropertiesChanged.dispatch();
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
           
            editor.project.physics[ 'collisionShapes' ] = this.getValue();
            signals.projectPropertiesChanged.dispatch();
        }
    );

    collisionShapesRow.add( new UIText( strings.getKey( 'sidebar/project/physics/collisionShapes' ) )
        .setClass( 'Label' )
    );
    collisionShapesRow.add( collisionShapes );
    container.add( collisionShapesRow );

    // Signals

    signals.editorCleared.add( function () {

        enable.setValue( false );
        editor.project.physics[ 'enable' ] = false;

        collisionShapes.setValue( false );
        editor.project.physics[ 'collisionShapes' ] = false;

    } );

    signals.projectPropertiesAdded.add( function ( project ) {

        enable.setValue( project.physics.enable );
        editor.project.physics[ 'enable' ] = project.physics.enable;

        collisionShapes.setValue( project.physics.collisionShapes );
        editor.project.physics[ 'collisionShapes' ] = project.physics.collisionShapes;

        signals.projectPropertiesChanged.dispatch();

    } );


    return container;

}

export { SidebarProjectPhysics };