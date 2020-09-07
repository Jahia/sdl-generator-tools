import {compose} from '../../compose';
import {connect} from 'react-redux';
import GQLSchemaViewer from './GQLSchemaViewer';

const mapStateToProps = ({sdlGeneratorTools: state}) => {
    return {
        nodeTypes: state.nodeTypes
    };
};

export default compose(
    connect(mapStateToProps, null)
)(GQLSchemaViewer);
