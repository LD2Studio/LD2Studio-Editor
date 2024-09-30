import { UIPanel, UIRow, UIText, UITextArea } from './libs/ui.js';

function SidebarProjectAddons( editor ) {

    const signals = editor.signals;
    const strings = editor.strings;

    const container = new UIPanel();
    container.setId( 'addons' );

    const headerRow = new UIRow();
	headerRow.add( new UIText( strings.getKey( 'sidebar/project/addons' ).toUpperCase() ) );
	container.add( headerRow );

    // user data

	const objectUserDataRow = new UIRow();
	const objectUserData = new UITextArea().setWidth( '250px' ).setHeight( '100px' ).setFontSize( '12px' ).onChange( update );
	objectUserData.onKeyUp( function () {

		try {

			JSON.parse( objectUserData.getValue() );

			objectUserData.dom.classList.add( 'success' );
			objectUserData.dom.classList.remove( 'fail' );

		} catch ( error ) {

			objectUserData.dom.classList.remove( 'success' );
			objectUserData.dom.classList.add( 'fail' );

		}

	} );

	objectUserDataRow.add( new UIText( strings.getKey( 'sidebar/object/userdata' ) ).setClass( 'Label' ) );
	objectUserDataRow.add( objectUserData );

    //

    function update() {
        
        try {

            const userData = JSON.parse( objectUserData.getValue() );
            
            if ( JSON.stringify( editor.addons ) != JSON.stringify( userData ) ) {

                editor.project.addons = userData;

                signals.projectPropertiesChanged.dispatch();
                signals.addonsUpdated.dispatch();

            }

        } catch ( exception ) {

            console.warn( exception );

        }
    }

	container.add( objectUserDataRow );

    // Signals

    signals.editorCleared.add( function () {

		objectUserData.setValue( JSON.stringify( editor.project.addons, null, '\t') );

	} );

    signals.refreshSidebarProject.add( function () {

        objectUserData.setValue( JSON.stringify( editor.project.addons, null, '\t') );

    } );

    return container;

}

export { SidebarProjectAddons }