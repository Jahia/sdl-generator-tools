import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import AceEditor from 'react-ace';
import 'brace/mode/graphqlschema';
import 'brace/theme/monokai';
import SDLParser from '../../parsing/sdlParser';
import C from '../../App.constants';
import {storeLocally} from '../../App.utils';
import * as _ from 'lodash';

let styles = theme => ({
    title: {
        marginBottom: theme.spacing.unit * 4
    },
    editor: {
        borderRadius: '0 0 3px 3px',
        background: theme.palette.ui.gamma + ' !important',
        '& .ace_gutter': {
            background: theme.palette.ui.gamma + ' !important'
        }
    }
});

const GQLSchemaViewer = ({classes, t, nodeTypes}) => {
    // Store generated result on window
    if (!_.isEmpty(nodeTypes)) {
        storeLocally(C.LOCAL_STORAGE, nodeTypes);
    }
    return (
        <React.Fragment>
            <Typography color="invert" variant="epsilon" className={classes.title}>
                {t('label.sdlGeneratorTools.viewerCaption')}
            </Typography>

            <AceEditor
                    readOnly
                    mode="graphqlschema"
                    theme="monokai"
                    name="gqlschema"
                    width="100%"
                    className={classes.editor}
                    value={SDLParser.parse(nodeTypes)}
                    editorProps={{$blockScrolling: false}}
                />
        </React.Fragment>
    );
};

GQLSchemaViewer.propTypes = {
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    nodeTypes: PropTypes.object.isRequired
};

export default compose(
    withStyles(styles),
    translate()
)(GQLSchemaViewer);
