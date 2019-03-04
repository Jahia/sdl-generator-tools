import {compose} from 'react-apollo';
import connect from 'react-redux/es/connect/connect';
import GQLSchemaViewer from './GQLSchemaViewer';

const mapStateToProps = state => {
    return state;
};

export default compose(
    connect(mapStateToProps, null)
)(GQLSchemaViewer);
