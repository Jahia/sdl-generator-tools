import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import GQLSchemaViewer from './GQLSchemaViewer';

const mapStateToProps = state => {
    return {
        nodeTypes: state.nodeTypes
    };
};

export default compose(
    connect(mapStateToProps, null)
)(GQLSchemaViewer);
