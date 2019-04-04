import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {withStyles, Grid} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import AceEditor from 'react-ace';
import 'brace/mode/graphqlschema';
import 'brace/theme/monokai';
import SDLParser from '../../parsing/sdlParser';
import C from '../../App.constants';
import {storeLocally} from '../../App.utils';
import * as _ from 'lodash';

let styles = () => ({
    viewerText: {
        padding: '12px 24px',
        fontWeight: 600,
        lineHeight: '18px',
        fontSize: '14px'
    },
    editor: {
        borderRadius: '0 0 3px 3px'
    }
});

const GQLSchemaViewer = ({classes, t, nodeTypes}) => {
    // Store generated result on window
    if (!_.isEmpty(nodeTypes)) {
        storeLocally(C.LOCAL_STORAGE, nodeTypes);
    }
    return (
        <React.Fragment>
            <Grid item>
                <Typography color="invert" variant="zeta" className={classes.viewerText}>
                    {t('label.sdlGeneratorTools.viewerCaption')}
                </Typography>
            </Grid>
            <Grid item>
                <AceEditor
                    readOnly
                    mode="graphqlschema"
                    theme="monokai"
                    name="gqlschema"
                    height="93%"
                    width="100%"
                    className={classes.editor}
                    value={SDLParser.parse(nodeTypes)}
                    editorProps={{$blockScrolling: false}}
                />
            </Grid>
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
