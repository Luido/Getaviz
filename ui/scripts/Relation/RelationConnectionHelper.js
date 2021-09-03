/**
* Main - Changes in CreateConnector Function
* by Luise Dose
 */
var createRelationConnectionHelper = function(controllerConfig) {
    return (function(controllerConfig) {

        const connectorSize = 0.05; //edge thickness

        function setConnectorMeshProperties(connectorElement, position, direction, width, length) {
            connectorElement.addEventListener("loaded", function () {
                const threeMesh = this.object3DMap.mesh;

                threeMesh.scale.set(width, length, width);
                threeMesh.position.set(position.x, position.y, position.z);

                const quaternion = threeMesh.quaternion;
                quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
            });
        }

        function setCommonConnectorHTMLProperties(connectorElement, rgbColorObj) {
            connectorElement.setAttribute("flat-shading", true);
            connectorElement.setAttribute("shader", "flat");
            const colorArr = [rgbColorObj.r, rgbColorObj.g, rgbColorObj.b];
            connectorElement.setAttribute("color", canvasManipulator.numbersToHexColor(colorArr.map(v => v * 255)));
        }

        function evaluatePositions(entity, relatedEntity) {
            let sourcePosition = canvasManipulator.getCenterOfEntity(entity);
            if (sourcePosition === null) {
                return {};
            }
            let targetPosition = canvasManipulator.getCenterOfEntity(relatedEntity);
            if (targetPosition === null) {
                return {};
            }

            if (controllerConfig.sourceStartAtParentBorder) {
                const sourceParent = entity.belongsTo;
                const targetParent = relatedEntity.belongsTo;
                if (sourceParent != targetParent) {
                    if (controllerConfig.targetEndAtParentBorder) {
                        targetPosition = canvasManipulator.getCenterOfEntity(targetParent);
                    }
                    const intersection = calculateBorderPosition(targetPosition, canvasManipulator.getCenterOfEntity(sourceParent), sourceParent);
                    if (intersection != undefined) {
                        sourcePosition = intersection;
                    } else console.debug("raycasting found no intersection with parent objects surface");
                }
            }

            if (controllerConfig.targetEndAtParentBorder) {
                const targetParent = relatedEntity.belongsTo;
                if (targetParent != entity.belongsTo) {
                    const intersection = calculateBorderPosition(sourcePosition, canvasManipulator.getCenterOfEntity(targetParent), targetParent);
                    if (intersection != undefined) {
                        targetPosition = intersection;
                    } else console.debug("raycasting found no intersection with parent objects surface");
                }
            }

            if (controllerConfig.sourceStartAtBorder) {
                if (controllerConfig.targetEndAtBorder) {
                    targetPosition = canvasManipulator.getCenterOfEntity(relatedEntity);
                }
                // getCenterOfEntity again in-case it got overwritten for sourceStartAtParentBorder
                sourcePosition = calculateBorderPosition(targetPosition, canvasManipulator.getCenterOfEntity(entity), entity);
            }
            if (controllerConfig.targetEndAtBorder) {
                // getCenterOfEntity again in-case it got overwritten for targetEndAtParentBorder
                targetPosition = calculateBorderPosition(sourcePosition, canvasManipulator.getCenterOfEntity(relatedEntity), relatedEntity);
            }

            // suggestion for city model: draw horizontal cylinders on the lower positions level
            if (controllerConfig.fixPositionY) {
                sourcePosition.y = Math.min(sourcePosition.y, targetPosition.y);
                targetPosition.y = sourcePosition.y;
            }

            return {
                sourcePosition: sourcePosition,
                targetPosition: targetPosition,
            };
        }

        function calculateBorderPosition(sourceOfRay, targetOfRay, entity) {
            const object = document.getElementById(entity.id);
            const raycaster = new THREE.Raycaster();
            raycaster.set(sourceOfRay, targetOfRay.subVectors(targetOfRay, sourceOfRay).normalize());
            const intersection = raycaster.intersectObject(object.object3DMap.mesh);
            return intersection[0].point;
        }

        function combineObjectProperties(leftObj, rightObj, mergeFunction) {
            const mergedObject = {};
            for (const key of Object.keys(leftObj)) {
                mergedObject[key] = mergeFunction(leftObj[key], rightObj[key]);
            }
            return mergedObject;
        }
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
        
>>>>>>> Stashed changes
=======
        
>>>>>>> Stashed changes
=======
        
>>>>>>> Stashed changes
/////////////// this is important /////////////////////
=======
=======
>>>>>>> Stashed changes
        
/**
 * Changes:
 *  -- create multiple small connectors to draw connection between source and target
 *  -- end_points_in_between: decides the number of connectors that are drawn (more precisly how many points inbetween source and target point will be calculated)
 *  -- max_plus_y: decides the main amplitude of the curve
 *  -- works fine with end_points_in_between = 14 and max_plus_y = 30
 */

>>>>>>> Stashed changes
        function createConnector(entity, relatedEntity, relationId) {
            const {sourcePosition, targetPosition} = evaluatePositions(entity, relatedEntity);
            if (!sourcePosition || !targetPosition) {
                return null;
            }

            const delta = combineObjectProperties(targetPosition, sourcePosition, (left, right) => left - right);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            const distance_start_end  = Math.sqrt((targetPosition.x-targetPosition.x)*(targetPosition.x-targetPosition.x));
            delta.x= delta.x-distance_start_end/3;
            delta.y = delta.y + distance_start_end/2;
=======
            
            /*// Luises Code
            //const distance_start_end  = Math.sqrt((targetPosition.x-targetPosition.x)*(targetPosition.x-targetPosition.x));
            //delta.x= delta.x-distance_start_end/3;
            //delta.y = delta.y + distance_start_end/2;*/
>>>>>>> Stashed changes
=======
            
>>>>>>> Stashed changes
=======
            
>>>>>>> Stashed changes
            const distance = sourcePosition.distanceTo(targetPosition);
            
            const direction = new THREE.Vector3(delta.x, delta.y, delta.z).normalize();

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            // create connector
            // const connector = document.createElement("a-curve")
            // need to set a-curve with 2 points (start and end)
            // then add my created class a-draw-curve and draw the curve 
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            const connector = document.createElement("a-cylinder");
=======
            //const connector = document.createElement("a-cylinder");
>>>>>>> Stashed changes
=======
            //const connector = document.createElement("a-cylinder");
>>>>>>> Stashed changes
            const halfwayPoint = combineObjectProperties(sourcePosition, delta, (left, right) => left + right / 2);
            
           // setConnectorMeshProperties(connector, halfwayPoint, direction, connectorSize, distance);
           // setCommonConnectorHTMLProperties(connector, controllerConfig.connectorColor);
           // connector.setAttribute("radius", 5);
           // connector.setAttribute("id", relationId);

            const scene = document.querySelector("a-scene");
            //scene.appendChild(connector);
           
=======
=======
>>>>>>> Stashed changes
            console.log(delta) // delta is the difference between startpoint and endpoint
            console.log(distance) // distance is euclidean distance between start and endpoint
            console.log(connectorSize)
            console.log('dir')
            console.log(direction)
<<<<<<< Updated upstream
             //create connector
            
            // need to set a-curve with 2 points (start and end)
            // then add my created class a-draw-curve and draw the curve 
            const connector1 = document.createElement("a-cylinder");
            const connector2= document.createElement("a-cylinder");

            console.log('position')
            console.log(sourcePosition)
            console.log(targetPosition)
            // half ist hälfte zwischen start ende
            //const halfwayPoint = combineObjectProperties(sourcePosition, delta, (left, right) => left + right / 2);

        
=======
           
            console.log('position')
            console.log(sourcePosition)
            console.log(targetPosition)
            
>>>>>>> Stashed changes
            var start = new THREE.Vector3(0,0,0);
            var end = new THREE.Vector3(0,0,0);
            var alle_punkte = [];

            const scene = document.querySelector("a-scene");
<<<<<<< Updated upstream
            const connectorElements = [];

            const end_points_in_between = 14;
            const max_plus_y = 30;

            const norm = function(val, max, min) { return (val - min) / (max - min); }


            for(let int_index_points = 0; int_index_points < end_points_in_between; int_index_points ++) {
                start.x = sourcePosition.x + (int_index_points) * (delta.x/end_points_in_between);
                start.y = sourcePosition.y + (delta.y/end_points_in_between)*(int_index_points);
                if(int_index_points == end_points_in_between/2){
                    start.y = start.y+max_plus_y;
                }else{
                    start.y = start.y + max_plus_y - norm( Math.abs(end_points_in_between/2-int_index_points), (end_points_in_between/2), 0)* norm( Math.abs(end_points_in_between/2-int_index_points), (end_points_in_between/2), 0)*max_plus_y;
                }
                start.z = sourcePosition.z+ (delta.z/end_points_in_between)*(int_index_points);
                console.log("Start");
                console.log(start);

                end.x = sourcePosition.x + (delta.x/end_points_in_between)*(int_index_points+1);
                end.y = sourcePosition.y + (delta.y/end_points_in_between)*(int_index_points+1);
                if(int_index_points+1 == end_points_in_between/2){
                    end.y = end.y+max_plus_y;
                }else{
                    end.y = end.y + max_plus_y - norm(Math.abs(end_points_in_between/2-(int_index_points+1)), (end_points_in_between/2),0)*norm(Math.abs(end_points_in_between/2-(int_index_points+1)), (end_points_in_between/2),0)*max_plus_y;
                }
                end.z = sourcePosition.z + (delta.z/end_points_in_between)*(int_index_points+1);

                console.log("End");
                console.log(end);  
                
                const delta_new = combineObjectProperties(end, start, (left, right) => left - right);
            
                const distance_new = start.distanceTo(end);
                
                const direction_new = new THREE.Vector3(delta_new.x, delta_new.y, delta_new.z).normalize();

                const connector_new = document.createElement("a-cylinder");
                const halfwayPoint_new = combineObjectProperties(start, delta_new, (left, right) => left + right / 2);

                setConnectorMeshProperties(connector_new, halfwayPoint_new, direction_new, connectorSize, distance_new);
                setCommonConnectorHTMLProperties(connector_new, controllerConfig.connectorColor);
                connector_new.setAttribute("radius", 5);
                connector_new.setAttribute("id", relationId+'_'+int_index_points);

                scene.appendChild(connector_new);
                
                connectorElements.push(connector_new);

                alle_punkte.push(start);
                alle_punkte.push(end);
            }
            
            /* setConnectorMeshProperties(connector1, halfwayPoint, direction, connectorSize, distance);
            setCommonConnectorHTMLProperties(connector1, controllerConfig.connectorColor);
            setConnectorMeshProperties(connector2, halfwayPoint_1, direction, connectorSize, distance);
            setCommonConnectorHTMLProperties(connector2, controllerConfig.connectorColor);
            connector1.setAttribute("radius", 5);
            connector1.setAttribute("id", relationId);

            const scene = document.querySelector("a-scene");
            scene.appendChild(connector1);
            scene.appendChild(connector2);
>>>>>>> Stashed changes
            //const bow = document.createElement("a-torus");
            //bow.setAttribute("position",sourcePosition);
            //bow.setAttribute("radius",10);
            //bow.setAttribute("color","hotpink");
            //bow.setAttribute("geometry","segmentsTubular",50);
            //scene.appendChild(bow);
            const connectorElements = [];
<<<<<<< Updated upstream
            //connectorElements.push(connector);
=======
            connectorElements.push(connector1);
            connectorElements.push(connector2);
            // TESTMIT DIREKT
            //const neue_curve = new THREE.CatmullRomCurve3({sourcePosition,halfwayPoint,targetPosition});
            //scene.appendChild(neue_curve);
            //
            //const scene = document.querySelector("a-scene");
>>>>>>> Stashed changes
            const start_point = document.createElement("a-curve-point");
            const end_point = document.createElement("a-curve-point");
            
            const curve = document.createElement("a-curve");

            const draw_curve = document.createElement("a-draw-curve");
            const rep_entity = document.createElement("a-entity");

            curve.setAttribute("id",relationId);
            curve.setAttribute("type","QuadraticBezier");
<<<<<<< Updated upstream

            start_point.setAttribute("position",sourcePosition);
            
            //start_point.setAttribute("position",{ x: 108.5, y: 15.8, z: 290.5 });
            //console.log(sourcePosition);
=======
            //start_point.setAttribute("position",sourcePosition);
            
            start_point.setAttribute("position",{ x: 108.5, y: 15.8, z: 290.5 });
            console.log(sourcePosition);
>>>>>>> Stashed changes
            start_point.setAttribute("geometry","primitive","box");
            start_point.setAttribute("geometry","height",0.1);
            start_point.setAttribute("geometry","width",0.1);
            start_point.setAttribute("geometry","depth",0.1);
            start_point.setAttribute("material","color:#fff");
            //curve.appendChild(start_point);

            
<<<<<<< Updated upstream
            end_point.setAttribute("position",targetPosition);
            //end_point.setAttribute("position",{ x: 143.5, y: 1.3, z: 275.5 });
            //console.log(targetPosition);
=======
            //end_point.setAttribute("position",targetPosition);
            end_point.setAttribute("position",{ x: 143.5, y: 1.3, z: 275.5 });
            console.log(targetPosition);
>>>>>>> Stashed changes
            end_point.setAttribute("geometry","primitive","box");
            end_point.setAttribute("geometry","height",0.1);
            end_point.setAttribute("geometry","width",0.1);
            end_point.setAttribute("geometry","depth",0.1);
            end_point.setAttribute("material","color:#fff");
            
            //curve.appendChild(start_point);
            //curve.appendChild(end_point);
            curve.append(start_point,end_point);
            //console.log(start_point);
            //curve.append(start_point);
            console.log(curve);
            //curve.append(end_point);
            
            draw_curve.setAttribute("curveref",relationId);
            draw_curve.setAttribute("material","shader", "line");
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            draw_curve.setAttribute("material", "color","blue");
=======
            draw_curve.setAttribute("material", "color","hotpink");
>>>>>>> Stashed changes
=======
            draw_curve.setAttribute("material", "color","hotpink");
>>>>>>> Stashed changes
            console.log(draw_curve);
            
            rep_entity.setAttribute("clone-along-curve","curve",relationId);
            rep_entity.setAttribute("clone-along-curve","spacing",0.1);
            rep_entity.setAttribute("geometry","primitive","cylinder"); 
            rep_entity.setAttribute("geometry","radius",10);
            console.log(rep_entity);
            connectorElements.push(curve);
            connectorElements.push(start_point);
            connectorElements.push(end_point);
            connectorElements.push(draw_curve);
            connectorElements.push(rep_entity);
            //connectorElements.push(bow);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            
            scene.appendChild(curve);
            scene.appendChild(draw_curve);
            scene.appendChild(rep_entity);
=======
            scene.appendChild(draw_curve);
            scene.appendChild(rep_entity);
            scene.appendChild(curve);
            
>>>>>>> Stashed changes
=======
            scene.appendChild(draw_curve);
            scene.appendChild(rep_entity);
            scene.appendChild(curve); */
            
>>>>>>> Stashed changes
            //scene.appendChild(bow);
            
            // create endpoints
            /**if (controllerConfig.createEndpoints) {
=======
            const connectorElements = [];

            const end_points_in_between = 14;
            const max_plus_y = 30;

            const norm = function(val, max, min) { return (val - min) / (max - min); }

=======
            console.log(delta) // delta is the difference between startpoint and endpoint
            console.log(distance) // distance is euclidean distance between start and endpoint
            console.log(connectorSize)
            console.log('dir')
            console.log(direction)
           
            console.log('position')
            console.log(sourcePosition)
            console.log(targetPosition)
            
            var start = new THREE.Vector3(0,0,0);
            var end = new THREE.Vector3(0,0,0);
            var alle_punkte = [];

            const scene = document.querySelector("a-scene");
            const connectorElements = [];

            const end_points_in_between = 14;
            //if(distance)
            var max_plus_y = 100;

            const norm = function(val, max, min) { return (val - min) / (max - min); }
            
			// dynamic change of max amplitude of the curve depending on distance between source- and targetpoint
            var factor = norm(distance,1000,0);
            console.log(factor);
            max_plus_y = Math.round(max_plus_y * factor);
            console.log(max_plus_y);
           
            
>>>>>>> Stashed changes
            // loop two create the coordinates of the points between source and target
            for(let int_index_points = 0; int_index_points < end_points_in_between; int_index_points ++) {
                start.x = sourcePosition.x + (int_index_points) * (delta.x/end_points_in_between);
                start.y = sourcePosition.y + (delta.y/end_points_in_between)*(int_index_points);
                // find the center of the curve (real halfwaypoint) and set it to the highest amplitude
                if(int_index_points == end_points_in_between/2){
                    start.y = start.y+max_plus_y;
                }else{
                    start.y = start.y + max_plus_y - norm( Math.abs(end_points_in_between/2-int_index_points), (end_points_in_between/2), 0)* norm( Math.abs(end_points_in_between/2-int_index_points), (end_points_in_between/2), 0)*max_plus_y;
                }
                start.z = sourcePosition.z+ (delta.z/end_points_in_between)*(int_index_points);
                console.log("Start");
                console.log(start);

                end.x = sourcePosition.x + (delta.x/end_points_in_between)*(int_index_points+1);
                end.y = sourcePosition.y + (delta.y/end_points_in_between)*(int_index_points+1);
                if(int_index_points+1 == end_points_in_between/2){
                    end.y = end.y+max_plus_y;
                }else{
                    end.y = end.y + max_plus_y - norm(Math.abs(end_points_in_between/2-(int_index_points+1)), (end_points_in_between/2),0)*norm(Math.abs(end_points_in_between/2-(int_index_points+1)), (end_points_in_between/2),0)*max_plus_y;
                }
                end.z = sourcePosition.z + (delta.z/end_points_in_between)*(int_index_points+1);

                console.log("End");
                console.log(end);  
                
                const delta_new = combineObjectProperties(end, start, (left, right) => left - right);
            
                const distance_new = start.distanceTo(end);
                
                const direction_new = new THREE.Vector3(delta_new.x, delta_new.y, delta_new.z).normalize();

                const connector_new = document.createElement("a-cylinder");
                const halfwayPoint_new = combineObjectProperties(start, delta_new, (left, right) => left + right / 2);

                setConnectorMeshProperties(connector_new, halfwayPoint_new, direction_new, connectorSize, distance_new);
                setCommonConnectorHTMLProperties(connector_new, controllerConfig.connectorColor);
                connector_new.setAttribute("radius", 5);
                connector_new.setAttribute("id", relationId+'_'+int_index_points);

                scene.appendChild(connector_new);
                
                connectorElements.push(connector_new);

                alle_punkte.push(start);
                alle_punkte.push(end);
            }
            
            
            // create endpoints (old code from original)
            if (controllerConfig.createEndpoints) {
>>>>>>> Stashed changes
                const size = connectorSize * 1.5;
                const length = size * 6;
                const sourceEndpoint = document.createElement("a-cylinder");
                setConnectorMeshProperties(sourceEndpoint, sourcePosition, direction, size, length);
                setCommonConnectorHTMLProperties(sourceEndpoint, controllerConfig.endpointColor);

                const targetEndpoint = document.createElement("a-cylinder");
                setConnectorMeshProperties(targetEndpoint, targetPosition, direction, size, length);
                setCommonConnectorHTMLProperties(targetEndpoint, controllerConfig.endpointColor);

                scene.appendChild(sourceEndpoint);
                console.log("hier endpunkt"+sourceEndpoint);
                scene.appendChild(targetEndpoint);
                connectorElements.push(sourceEndpoint);
                connectorElements.push(targetEndpoint);
            }*/
            return connectorElements;
        }

        return {
            createConnector: createConnector,
        };
    })(controllerConfig);
};
