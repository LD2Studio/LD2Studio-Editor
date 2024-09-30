import { UISpan } from './libs/ui.js';

import { SidebarProjectApp } from './Sidebar.Project.App.js';
/* import { SidebarProjectMaterials } from './Sidebar.Project.Materials.js'; */
import { SidebarProjectRenderer } from './Sidebar.Project.Renderer.js';
import { SidebarProjectImage } from './Sidebar.Project.Image.js';
import { SidebarProjectVideo } from './Sidebar.Project.Video.js';
import { SidebarProjectPhysics } from './Sidebar.Project.Physics.js';
import { SidebarProjectAddons } from './Sidebar.Project.Addons.js';

function SidebarProject( editor ) {

	const container = new UISpan();

	container.add( new SidebarProjectRenderer( editor ) );

	/* container.add( new SidebarProjectMaterials( editor ) ); */

	container.add( new SidebarProjectApp( editor ) );

	container.add( new SidebarProjectImage( editor ) );

	if ( 'SharedArrayBuffer' in window ) {

		container.add( new SidebarProjectVideo( editor ) );

	}

	container.add( new SidebarProjectPhysics( editor ) );

	container.add( new SidebarProjectAddons( editor ) );

	return container;

}

export { SidebarProject };
