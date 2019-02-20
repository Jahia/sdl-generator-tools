import React from 'react';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {withStyles, Typography, Grid} from '@material-ui/core';
import AceEditor from 'react-ace';
import 'brace/mode/graphqlschema';
import 'brace/theme/monokai';
import SDLParser from '../parsing/sdlParser';

let styles = theme => ({
    viewerText: {
        padding: '12px 24px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '18px',
        fontSize: '14px',
        color: '#fff'
    },
    editor: {
        borderRadius: "0 0 3px 3px"
    }
});

const GQLSchemaViewer = ({classes, t, nodeTypes}) => {
    return (
        <React.Fragment>
            <Grid item>
                <Typography className={classes.viewerText}>
                    {t('label.sdlGeneratorTools.viewerCaption')}
                </Typography>
            </Grid>
            <Grid item>
                <AceEditor
                    className={classes.editor}
                    readOnly
                    mode="graphqlschema"
                    theme="monokai"
                    value={SDLParser.parse(nodeTypes)}
                    name="gqlschema"
                    height="93%"
                    width="100%"
                    editorProps={{$blockScrolling: false}}
                />
            </Grid>
        </React.Fragment>
    );
};

export default compose(
    withStyles(styles),
    translate()
)(GQLSchemaViewer);
