package org.getaviz.generator.abap.metropolis.steps;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.getaviz.generator.SettingsConfiguration;
import org.getaviz.generator.abap.enums.SAPNodeProperties;
import org.getaviz.generator.abap.enums.SAPNodeTypes;
import org.getaviz.generator.abap.enums.SAPRelationLabels;
import org.getaviz.generator.abap.layouts.ADistrictLightMapLayout;
import org.getaviz.generator.abap.layouts.ABuildingLayout;
import org.getaviz.generator.abap.layouts.ADistrictCircluarLayout;
import org.getaviz.generator.abap.repository.ACityElement;
import org.getaviz.generator.abap.repository.ACityRepository;
import org.getaviz.generator.abap.repository.SourceNodeRepository;
import org.neo4j.driver.v1.Value;
import org.neo4j.driver.v1.types.Node;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class MetropolisLayouter {

    private Log log = LogFactory.getLog(this.getClass());
    private SettingsConfiguration config;


    private SourceNodeRepository nodeRepository;
    private ACityRepository repository;

    public MetropolisLayouter(ACityRepository aCityRepository, SourceNodeRepository sourceNodeRepository, SettingsConfiguration config) {
        this.config = config;

        repository = aCityRepository;
        nodeRepository = sourceNodeRepository;

        log.info("*****************************************************************************************************************************************");
        log.info("created");

    }


    public void layoutRepository(){

        Collection<ACityElement> buildings = repository.getElementsByType(ACityElement.ACityType.Building);
        log.info(buildings.size() + " buildings loaded");

        for (ACityElement building: buildings) {

            SAPNodeTypes sourceNodeType = building.getSourceNodeType();

            if(sourceNodeType == SAPNodeTypes.TableType) {
                SAPNodeTypes buildingSourceType = getTableTypeTypeOfType(building);

                if (buildingSourceType != null) {
                    layoutTableTypeBuilding(building, buildingSourceType);

                    log.info(building.getSourceNodeProperty(SAPNodeProperties.type_name) + " \""
                            + building.getSourceNodeProperty(SAPNodeProperties.object_name) + "\""
                            + " with rowType " + "\"" + building.getSourceNodeProperty(SAPNodeProperties.rowtype) + "\""
                            + " layouted");
                }
            } else {
                layoutBuilding(building);
            }
        }

        /*Collection<ACityElement> parentElements = getParentDistricts(buildings);
        Collection<ACityElement> emptyDistricts  = getEmptyDistricts();

        layoutEmptyDistricts(emptyDistricts);

        parentElements.add(emptyDistricts);

        layoutDistricts();
         */

        layoutEmptyDistricts(buildings);
        layoutParentDistricts(buildings);

        layoutCloudModel();

    }

    private SAPNodeTypes getTableTypeTypeOfType(ACityElement building) {

        Node tableTypeSourceNode = building.getSourceNode();

        Collection<Node> typeOfNodes = nodeRepository.getRelatedNodes(tableTypeSourceNode, SAPRelationLabels.TYPEOF, true);
        if(typeOfNodes.isEmpty()){
            String tableTypeName = building.getSourceNodeProperty(SAPNodeProperties.object_name);
            log.warn("TYPEOF related nodes not found for tableType \"" + tableTypeName + "\"");
            return null;
        }
        if(typeOfNodes.size() != 1){
            String tableTypeName = building.getSourceNodeProperty(SAPNodeProperties.object_name);
            log.error("TYPEOF related nodes more than 1 for tableType \"" + tableTypeName + "\"");
            return null;
        }

        for (Node typeOfNode: typeOfNodes) {
            Value propertyValue = typeOfNode.get(SAPNodeProperties.type_name.name());
            String typeOfNodeTypeProperty = propertyValue.asString();

            return SAPNodeTypes.valueOf(typeOfNodeTypeProperty);
        }

        return null;
    }

    private void layoutTableTypeBuilding(ACityElement building, SAPNodeTypes typeOfType) {

        switch (typeOfType){
            case Class:
            case Interface:
                building.setHeight(config.getACityTableTypeBuildingHeight("tableTypeBuilding_class"));
                break;
            case Table:
            case TableType:
                building.setHeight(config.getACityTableTypeBuildingHeight("tableTypeBuilding_table"));
                break;
            case Structure:
                building.setHeight(config.getACityTableTypeBuildingHeight("tableTypeBuilding_structure"));
                break;
            case DataElement:
                building.setHeight(config.getACityTableTypeBuildingHeight("tableTypeBuilding_dateElement"));
            default:
                building.setHeight(1);
                String tableTypeName = building.getSourceNodeProperty(SAPNodeProperties.type_name);
                log.error("Type \"" + typeOfType + "\" not allowed for tableType-Element \"" +  tableTypeName );
        }


        Double groundAreaLength = config.getACityGroundAreaByChimneyAmount();
        building.setWidth(groundAreaLength);
        building.setLength(groundAreaLength);

        building.setXPosition(0.0);
        building.setYPosition(building.getHeight() / 2);
        building.setZPosition(0.0);
    }

    private String getRowtype(ACityElement aCityElement){

        if (aCityElement.getSourceNodeProperty(SAPNodeProperties.type_name).equals(SAPNodeTypes.TableType.name())){
            if (aCityElement.getSourceNodeProperty(SAPNodeProperties.rowtype) == null) {
                return "TableType doesn't have a rowType";
            }

        }
        return aCityElement.getSourceNodeProperty(SAPNodeProperties.rowtype);
    }

    private void layoutEmptyDistricts( Collection<ACityElement> districtElements) {

        Collection<ACityElement> districts = repository.getElementsByType(ACityElement.ACityType.District);

        for (ACityElement district: districts) {

            if (district.getSubElements().isEmpty()) {

                district.setHeight(config.getMetropolisEmptyDistrictHeight());
                district.setLength(config.getMetropolisEmptyDistrictLength());
                district.setWidth(config.getMetropolisEmptyDistrictWidth());

                ACityElement parentElementOfEmptyDistricts = district.getParentElement();

                if (parentElementOfEmptyDistricts != null) {

                    districtElements.add(district);

                }
            }
        }
    }

    private void layoutParentDistricts(Collection<ACityElement> districtElements) {

        Collection<ACityElement> parentDistricts = getParentDistricts(districtElements);

        log.info(parentDistricts.size() + " parentDistrict loaded"); // first for buildings, then for typedistricts

        for(ACityElement parentDistrict : parentDistricts) {
            layoutDistrict(parentDistrict);
        }

        if (!parentDistricts.isEmpty()) {
            layoutParentDistricts(parentDistricts);
        } else {
            layoutVirtualRootDistrict();
        }
    }


    private Collection<ACityElement> getParentDistricts(Collection<ACityElement> elements) {
        Map<String, ACityElement> parentDistricts = new HashMap<>();
        for(ACityElement element : elements){

            ACityElement parentElement = element.getParentElement();
            if(parentElement == null){
                continue;
            }

            String hash = parentElement.getHash();
            if(!parentDistricts.containsKey(hash)){
                parentDistricts.put(hash, parentElement);
            }
        }
        return parentDistricts.values();
    }

    private void layoutBuilding(ACityElement building) {

        Collection<ACityElement> floors = building.getSubElementsOfType(ACityElement.ACityType.Floor);
        Collection<ACityElement> chimneys = building.getSubElementsOfType(ACityElement.ACityType.Chimney);

        ABuildingLayout buildingLayout = new ABuildingLayout(building, floors, chimneys, config);
        buildingLayout.calculate();

        if (floors.size() != 0) {
            log.info(building.getSourceNodeType() + " " + "\"" + building.getSourceNodeProperty(SAPNodeProperties.object_name) + "\"" + " with " + floors.size() + " floors");
        }
        if (chimneys.size() != 0) {
            log.info(building.getSourceNodeType() + " " + "\"" + building.getSourceNodeProperty(SAPNodeProperties.object_name) + "\"" + " with " + chimneys.size() + " chimneys");
        }
    }

    private void layoutCloudModel() {

        Collection<ACityElement> clouds = repository.getElementsByTypeAndSourceProperty(ACityElement.ACityType.District, SAPNodeProperties.migration_findings, "true");

        for ( ACityElement cloud: clouds) {
            if (!cloud.getSourceNodeType().equals(SAPNodeTypes.Namespace)) {

                Collection<ACityElement> cloudSubElements = cloud.getSubElements();

                if(!cloudSubElements.isEmpty()) {

                    for (ACityElement cloudSubElement : cloudSubElements) {

                        if (cloudSubElement.getSubType() == null){
                            continue;
                        } else if((cloudSubElement.getSubType().equals(ACityElement.ACitySubType.Cloud))){

                            cloudSubElement.setWidth(0);
                            cloudSubElement.setLength(0);
                            cloudSubElement.setYPosition(55);

                            double parentDistrictXPosition = cloudSubElement.getParentElement().getXPosition();
                            double parentDistrictZPosition = cloudSubElement.getParentElement().getZPosition();

                            cloudSubElement.setXPosition(parentDistrictXPosition);
                            cloudSubElement.setZPosition(parentDistrictZPosition);

                            cloudSubElement.setWidth(0);
                            cloudSubElement.setLength(0);
                        }
                    }
                }
            }
        }

    }

    private void layoutDistrict(ACityElement district) {

        if (district.getType() == ACityElement.ACityType.District) {

            Collection<ACityElement> subElements = district.getSubElements();

            Collection<ACityElement> referenceElements = repository.getElementsByType(ACityElement.ACityType.Reference);

            for (ACityElement referenceElement: referenceElements) {
                layoutReference(referenceElement);
            }

            ADistrictLightMapLayout aBAPDistrictLightMapLayout = new ADistrictLightMapLayout(district, subElements, config);
            aBAPDistrictLightMapLayout.calculate();

            log.info("\"" + district.getSourceNodeProperty(SAPNodeProperties.object_name) + "\"" + "-District with " + subElements.size() + " subElements layouted");

        }
    }

    private void layoutReference(ACityElement referenceElement) {
        ACityElement.ACitySubType referenceBuildingType = referenceElement.getSubType();

            switch (referenceBuildingType) {
                case Sea:
                    referenceElement.setHeight(config.getMetropolisReferenceBuildingHeigth("seaReferenceBuilding"));
                    referenceElement.setWidth(config.getMetropolisReferenceBuildingWidth("seaReferenceBuilding"));
                    referenceElement.setLength(config.getMetropolisReferenceBuildingLength("seaReferenceBuilding"));
                    break;

                case Mountain:
                    referenceElement.setHeight(config.getMetropolisReferenceBuildingHeigth("mountainReferenceBuilding"));
                    referenceElement.setWidth(config.getMetropolisReferenceBuildingWidth("mountainReferenceBuilding"));
                    referenceElement.setLength(config.getMetropolisReferenceBuildingLength("mountainReferenceBuilding"));
                    break;

                case Cloud:
                    referenceElement.setHeight(config.getMetropolisReferenceBuildingHeigth("cloudReferenceBuilding"));
                    referenceElement.setWidth(config.getMetropolisReferenceBuildingWidth("cloudReferenceBuilding"));
                    referenceElement.setLength(config.getMetropolisReferenceBuildingLength("cloudReferenceBuilding"));
                    break;
            }
    }


    private void layoutVirtualRootDistrict(){
        Collection<ACityElement> districtsWithoutParents = repository.getElementsByTypeAndSourceProperty(ACityElement.ACityType.District, SAPNodeProperties.type_name, "Namespace");

        for (ACityElement districtsWithoutParent : districtsWithoutParents) {

            if (districtsWithoutParent.getParentElement() == null) {

                ACityElement virtualRootDistrict = new ACityElement(ACityElement.ACityType.District);

                if (config.getAbapNotInOrigin_layout() == SettingsConfiguration.NotInOriginLayout.DEFAULT) {

                    ADistrictLightMapLayout aDistrictLightMapLayout = new ADistrictLightMapLayout(virtualRootDistrict, districtsWithoutParents, config);
                    aDistrictLightMapLayout.calculate();

                } else if (config.getAbapNotInOrigin_layout() == SettingsConfiguration.NotInOriginLayout.CIRCULAR) {

                    ADistrictCircluarLayout aDistrictLayout = new ADistrictCircluarLayout(virtualRootDistrict, districtsWithoutParents, config);
                    aDistrictLayout.calculate();
                }

            }
        }
    }
}