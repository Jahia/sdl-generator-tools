import React from 'react';
import PropTypes from 'prop-types';
import {compose, graphql, withApollo} from 'react-apollo';
import gqlQueries from '../CreateTypes.gql-queries';
import AddModifyPropertyDialog from './AddModifyPropertyDialog';
import {lookUpMappingStringArgumentInfo} from '../../StepperComponent.utils';
import * as _ from 'lodash';

const AddModifyPropertyDialogContainer = ({data, open, closeDialog, mode, selectedType, selectedProperty, addProperty, removeProperty, isDuplicatedPropertyName}) => {
    console.log('Container refresh');
    const nodes = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes : [];
    const nodeProperties = nodes.length > 0 ? nodes[0].properties : [];

    return (
        <AddModifyPropertyDialog open={open}
                                 mode={mode}
                                 selectableProps={nodeProperties}
                                 selectedType={selectedType}
                                 selectedProperty={selectedProperty}
                                 closeDialog={closeDialog}
                                 addProperty={addProperty}
                                 isDuplicatedPropertyName={isDuplicatedPropertyName}
                                 removeProperty={removeProperty}/>
    );
};

AddModifyPropertyDialogContainer.propTypes = {
    open: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    addProperty: PropTypes.func.isRequired,
    removeProperty: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    selectedType: PropTypes.string.isRequired,
    isDuplicatedPropertyName: PropTypes.func.isRequired,
    selectedProperty: PropTypes.object
};

AddModifyPropertyDialogContainer.defaultProps = {
    selectedProperty: {}
};

const CompositeComp = compose(
    graphql(gqlQueries.NODE_TYPE_PROPERTIES, {
        options(props) {
            return {
                variables: {
                    includeTypes: [lookUpMappingStringArgumentInfo(props.selectedType, 'node')]
                },
                fetchPolicy: 'network-only'
            };
        }
    })
)(AddModifyPropertyDialogContainer);

export default withApollo(CompositeComp);
