import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

const styles = () => ({
    highlight: {
        color: '#ff1e25',
        fontWeight: 600
    }
});

const TypographyWithHighlight = ({classes, content, part}) => {
    const splitContents = content.split(new RegExp(part, 'gi'));

    if (splitContents.length <= 1) {
        return content;
    }

    const matches = content.match(new RegExp(part, 'gi'));

    return splitContents.reduce((arr, element, index) => (matches[index] ? [
        ...arr,
        element,
        /* eslint-disable-next-line */
        <span key={`${element}_${index}`} className={classes.highlight}>{matches[index]}</span>
    ] : [...arr, element]), []);
};

TypographyWithHighlight.propTypes = {
    content: PropTypes.string.isRequired
};

export default withStyles(styles)(TypographyWithHighlight);
