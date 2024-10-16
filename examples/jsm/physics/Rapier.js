import { Vector3, Quaternion, Matrix4,
    LineSegments, BufferGeometry, LineBasicMaterial, BufferAttribute } from 'three';

const RAPIER_PATH = 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.12.0';

const frameRate = 60;
let intervalId = null;

const _scale = new Vector3( 1, 1, 1 );
const ZERO = new Vector3();

let RAPIER = null;

function getShape( geometry ) {

   const parameters = geometry.parameters;

   // TODO change type to is*

   if ( geometry.type === 'BoxGeometry' ) {

       const sx = parameters.width !== undefined ? parameters.width / 2 : 0.5;
       const sy = parameters.height !== undefined ? parameters.height / 2 : 0.5;
       const sz = parameters.depth !== undefined ? parameters.depth / 2 : 0.5;

       return RAPIER.ColliderDesc.cuboid( sx, sy, sz );

   } else if ( geometry.type === 'SphereGeometry' || geometry.type === 'IcosahedronGeometry' ) {

       const radius = parameters.radius !== undefined ? parameters.radius : 1;
       return RAPIER.ColliderDesc.ball( radius );

   } else if ( geometry.type === 'CapsuleGeometry' ) {

       const radius = parameters.radius !== undefined ? parameters.radius : 1;
       const halfHeight = parameters.length !== undefined ? parameters.length / 2 : 0.5;
       return RAPIER.ColliderDesc.capsule( halfHeight, radius );

   } else if ( geometry.type === 'BufferGeometry' ) {

       const vertices = [];
       const vertex = new Vector3();
       const position = geometry.getAttribute( 'position' );

       for ( let i = 0; i < position.count; i ++ ) {

           vertex.fromBufferAttribute( position, i );
           vertices.push( vertex.x, vertex.y, vertex.z );

       }

       // if the buffer is non-indexed, generate an index buffer
       const indices = geometry.getIndex() === null
                           ? Uint32Array.from( Array( parseInt( vertices.length / 3 ) ).keys() )
                           : geometry.getIndex().array;

       return RAPIER.ColliderDesc.trimesh( vertices, indices );

   }

   return null;

}

async function RapierPhysics() {

   if ( RAPIER === null ) {

       RAPIER = await import( `${RAPIER_PATH}` );
       await RAPIER.init();

   }

   // Docs: https://rapier.rs/docs/api/javascript/JavaScript3D/

   const gravity = new Vector3( 0.0, - 9.81, 0.0 );
   const world = new RAPIER.World( gravity );
   window.world = world;

   let meshes = [];
   let meshMap = new WeakMap();
   let bodies = []; // Keep track of all created bodies.

   const debugMesh = new LineSegments(
       new BufferGeometry(),
       new LineBasicMaterial({
           color: 0xffffff,
           vertexColors: true
       })
   );
   showDebug( false );

   const _vector = new Vector3();
   const _quaternion = new Quaternion();
   const _matrix = new Matrix4();

   function addScene( scene ) {

       scene.traverse( function ( child ) {

           if ( child.isMesh ) {
               
               const physics = child.userData.physics;

               if ( physics ) {

                   addMesh( child, physics );
                   
               }

           }

       } );

       scene.add( debugMesh );
   }

    function addMesh( mesh,
        { mass = 0, restitution = 0, mode = 'none' } = {} ) {

        if ( mode === 'none' ) return;

        if ( ![ 'dynamic', 'fixed', 'kinematic_position', 'kinematic_velocity' ].includes( mode ) ) {

            console.warn( `[${ mesh.name }] Unknown physics mode: ${ mode }` );
            return;
        }

        const shape = getShape( mesh.geometry );

        if ( shape === null ) return;

        shape.setMass( mass );
        shape.setRestitution( restitution );

        const body = mesh.isInstancedMesh
                            ? createInstancedBody( mesh, mass, shape, mode )
                            : createBody( mesh.position, mesh.quaternion, mass, shape, mode );

        bodies.push( body );

        if ( mode !== 'fixed' ) {

            meshes.push( mesh );
            meshMap.set( mesh, body );

        }

   }

   function createInstancedBody( mesh, mass, shape, mode ) {

       const array = mesh.instanceMatrix.array;

       const bodies = [];

       for ( let i = 0; i < mesh.count; i ++ ) {

           const position = _vector.fromArray( array, i * 16 + 12 );
           bodies.push( createBody( position, null, mass, shape, mode ) );

       }

       return bodies;

   }

   function createBody( position, quaternion, mass, shape, mode ) {
        
        let desc;

        if ( mode === 'kinematic_velocity' ) {

            desc = RAPIER.RigidBodyDesc.kinematicVelocityBased();
            desc.setTranslation( ...position );
            if ( quaternion !== null ) desc.setRotation( quaternion );

        }

        else if ( mode === 'kinematic_position' ) {

            desc = RAPIER.RigidBodyDesc.kinematicPositionBased();
            desc.setTranslation( ...position );
            if ( quaternion !== null ) desc.setRotation( quaternion );

        }
        else if ( mode === 'dynamic' ) {

            desc = RAPIER.RigidBodyDesc.dynamic();
            desc.setTranslation( ...position );
            if ( quaternion !== null ) desc.setRotation( quaternion );

        }

        else if ( mode === 'fixed' ) {

            desc = RAPIER.RigidBodyDesc.fixed();
            desc.setTranslation( ...position );
            if ( quaternion !== null ) desc.setRotation( quaternion );

        }

        else {

            console.warn( 'Unknown mode: ' + mode );
            desc = RAPIER.RigidBodyDesc.fixed();
            desc.setTranslation( ...position );
            if ( quaternion !== null ) desc.setRotation( quaternion );

        }

        const body = world.createRigidBody( desc );
        world.createCollider( shape, body );

        return body;

   }

    function setMeshPosition( mesh, position, index = 0 ) {

        let body = meshMap.get( mesh );

        if ( mesh.isInstancedMesh ) {

            body = body[ index ];

        }

        // https://rapier.rs/javascript3d/enums/RigidBodyType.html

        // console.log( body.bodyType() );

        if ( body.bodyType() === RAPIER.RigidBodyType.Dynamic ) {

            body.setAngvel( ZERO );
            body.setLinvel( ZERO );
            body.setTranslation( position );
        }
        else if ( body.bodyType() === RAPIER.RigidBodyType.KinematicPositionBased ) {

            body.setNextKinematicTranslation( position );

        }

   }

   function setMeshVelocity( mesh, velocity, index = 0 ) {

       let body = meshMap.get( mesh );

       if ( mesh.isInstancedMesh ) {

           body = body[ index ];

       }

       body.setLinvel( velocity );

   }

   function setMeshAngularVelocity( mesh, angularVelocity, index = 0 ) {

       let body = meshMap.get( mesh );

       if ( mesh.isInstancedMesh ) {

           body = body[ index ];

       }

       body.setAngvel( angularVelocity );
   }

   function dispose () {
       
       // console.log( meshes );
       // console.log( meshMap );
       // console.log( bodies );

       bodies.forEach( body => {
           world.removeRigidBody( body );
       } );

       meshes = [];
       meshMap = new WeakMap();
       bodies = [];

       // let rigidBodySet = world.bodies;
       // console.log( rigidBodySet.getAll() ); // Should be empty
   }

   function showDebug( value ) {

       debugMesh.visible = value;

   }

   //

   function step() {
       
       world.timestep =  1 / frameRate;
       world.step();

       //

       for ( let i = 0, l = meshes.length; i < l; i ++ ) {

           const mesh = meshes[ i ];

           if ( mesh.isInstancedMesh ) {

               const array = mesh.instanceMatrix.array;
               const bodies = meshMap.get( mesh );

               for ( let j = 0; j < bodies.length; j ++ ) {

                   const body = bodies[ j ];

                   const position = body.translation();
                   _quaternion.copy( body.rotation() );

                   _matrix.compose( position, _quaternion, _scale ).toArray( array, j * 16 );

               }

               mesh.instanceMatrix.needsUpdate = true;
               mesh.computeBoundingSphere();

           } else {

               const body = meshMap.get( mesh );

               mesh.position.copy( body.translation() );
               mesh.quaternion.copy( body.rotation() );

           }

       }

       const { vertices, colors } = world.debugRender();
       debugMesh.geometry.setAttribute('position', new BufferAttribute(vertices, 3));
       debugMesh.geometry.setAttribute('color', new BufferAttribute(colors, 4));

   }

   // animate
   function start() {

       intervalId = setInterval( step, 1000 / frameRate );
       
   }

   function stop() {

       clearInterval( intervalId );

   }

   return {
       addScene,
       addMesh,
       setMeshPosition,
       setMeshVelocity,
       setMeshAngularVelocity,
       start,
       stop,
       dispose,
       showDebug
   };

}

export { RapierPhysics };
