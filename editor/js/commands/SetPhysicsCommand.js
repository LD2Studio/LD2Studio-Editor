import { Command } from '../Command.js';

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param physics javascript object
 * @constructor
 */
class SetPhysicsCommand extends Command {

	constructor( editor, object = null, physicsType = '' ) {

		super( editor );

		this.type = 'SetPhysicsCommand';
		this.name = editor.strings.getKey( 'command/SetPhysics' );

		this.object = object;
		this.physicsType = physicsType;

	}

	execute() {

		if ( this.editor.physics[ this.object.uuid ] === undefined ) {
			console.log( 'New physics uuid', this.object.uuid, this.physicsType );
			this.editor.physics[ this.object.uuid ] = {};

		}
		else {
			console.log( 'Existing physics uuid', this.object.uuid, this.physicsType );
			this.editor.physics[ this.object.uuid ] = {};
		}

		switch ( this.physicsType ) {
			case 'none': {
				this.editor.physics[ this.object.uuid ].type = 'none';	
				break;
			}
			case 'fixed': {
				this.editor.physics[ this.object.uuid ].type = 'fixed';
				break;
			}
			case 'dynamic': {
				this.editor.physics[ this.object.uuid ].type = 'dynamic';
				this.editor.physics[ this.object.uuid ].mass = 1.0;
				break;
			}
			case 'kinematic_velocity': {
				this.editor.physics[ this.object.uuid ].type = 'kinematic_velocity';
				break;
			}
			case 'kinematic_position': {
				this.editor.physics[ this.object.uuid ].type = 'kinematic_position';
				break;
			}
			default: break;
		}

	}

	undo() {

		if ( this.editor.physics[ this.object.uuid ] === undefined ) return;

		// const index = this.editor.physics[ this.object.uuid ].indexOf( this.script );

		// if ( index !== - 1 ) {

		// 	this.editor.scripts[ this.object.uuid ].splice( index, 1 );

		// }

		// this.editor.signals.scriptRemoved.dispatch( this.script );

	}

	toJSON() {

		// const output = super.toJSON( this );

		// output.objectUuid = this.object.uuid;
		// output.script = this.script;

		// return output;

	}

	fromJSON( json ) {

		// super.fromJSON( json );

		// this.script = json.script;
		// this.object = this.editor.objectByUuid( json.objectUuid );

	}

}

export { SetPhysicsCommand };
