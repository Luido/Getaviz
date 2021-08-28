var createRelationConnectionHelper = function(controllerConfig) {
    return (function(controllerConfig) {

        const connectorSize = 0.05;

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
=======
        
>>>>>>> Stashed changes
/////////////// this is important /////////////////////
        function createConnector(entity, relatedEntity, relationId) {
            const {sourcePosition, targetPosition} = evaluatePositions(entity, relatedEntity);
            if (!sourcePosition || !targetPosition) {
                return null;
            }

            const delta = combineObjectProperties(targetPosition, sourcePosition, (left, right) => left - right);
            const distance_start_end  = Math.sqrt((targetPosition.x-targetPosition.x)*(targetPosition.x-targetPosition.x));
            delta.x= delta.x-distance_start_end/3;
            delta.y = delta.y + distance_start_end/2;
            const distance = sourcePosition.distanceTo(targetPosition);
            const direction = new THREE.Vector3(delta.x, delta.y, delta.z).normalize();

            // create connector
            // const connector = document.createElement("a-curve")
            // need to set a-curve with 2 points (start and end)
            // then add my created class a-draw-curve and draw the curve 
<<<<<<< Updated upstream
            const connector = document.createElement("a-cylinder");
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
           
            //const bow = document.createElement("a-torus");
            //bow.setAttribute("position",sourcePosition);
            //bow.setAttribute("radius",10);
            //bow.setAttribute("color","hotpink");
            //bow.setAttribute("geometry","segmentsTubular",50);
            //scene.appendChild(bow);
            const connectorElements = [];
            //connectorElements.push(connector);
            const start_point = document.createElement("a-curve-point");
            const end_point = document.createElement("a-curve-point");
            
            const curve = document.createElement("a-curve");

            const draw_curve = document.createElement("a-draw-curve");
            const rep_entity = document.createElement("a-entity");

            curve.setAttribute("id",relationId);
            curve.setAttribute("type","QuadraticBezier");

            start_point.setAttribute("position",sourcePosition);
            
            //start_point.setAttribute("position",{ x: 108.5, y: 15.8, z: 290.5 });
            //console.log(sourcePosition);
            start_point.setAttribute("geometry","primitive","box");
            start_point.setAttribute("geometry","height",0.1);
            start_point.setAttribute("geometry","width",0.1);
            start_point.setAttribute("geometry","depth",0.1);
            start_point.setAttribute("material","color:#fff");
            //curve.appendChild(start_point);

            
            end_point.setAttribute("position",targetPosition);
            //end_point.setAttribute("position",{ x: 143.5, y: 1.3, z: 275.5 });
            //console.log(targetPosition);
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
            draw_curve.setAttribute("material", "color","blue");
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
            
            scene.appendChild(curve);
            scene.appendChild(draw_curve);
            scene.appendChild(rep_entity);
            //scene.appendChild(bow);
            
            // create endpoints
            if (controllerConfig.createEndpoints) {
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
            }
            return connectorElements;
        }

        return {
            createConnector: createConnector,
        };
    })(controllerConfig);
};
