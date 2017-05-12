import React from 'react';
import PropTypes from 'prop-types';

class Wufoo extends React.Component {
    constructor (props) {
        super(props);
        this.getSrc = this.getSrc.bind(this);
        this.embedForm = this.embedForm.bind(this);
        this.runScript = this.runScript.bind(this);
        this.createScript = this.createScript.bind(this);
    }
    
    /**
     * Get the full url of the embed src
     * @return {string} URL of embed
     */
    getSrc() {
        return `https://www.${this.props.host}${this.props.embedJs}`;
    }

    /**
     * Run the Embed Code
     */
    embedForm() {
        let self = this;
        let form;
        let rs = this.readyState; 
        if (rs && rs !== 'complete' && rs !== 'loaded') {
            return;
        }
        try {
            form = new window.WufooForm();
            form.initialize(self.props);
            form.display();
        } catch (e) {
            throw e;
        }
    }

    runScript() {
        return typeof window.WufooForm !== 'function' ? this.createScript() : this.embedForm();
    }


    /**
     * Load the Wufoo Embed JS file
     * @return {Object} script object created
     */
    createScript() {
        const self = this;
        let s = document.createElement('script');
        s.src = this.getSrc();
        s.onload = s.onreadystatechange = function() {
            return self.embedForm();
        };
        let scr = document.getElementsByTagName('script')[0];
        let par = scr.parentNode;
        par.insertBefore(s, scr);
        return scr;
    }

    componentDidUpdate() {
        this.runScript();
    }

    componentDidMount() {
        this.runScript();
    }

    render() {
        return (<div id={`wufoo-${this.props.formHash}`}></div>);
    }
}

Wufoo.propTypes = {
    async: PropTypes.bool,
    autoResize: PropTypes.bool,
    defaultValues: PropTypes.string,
    embedJs: PropTypes.string,
    formHash: PropTypes.string.isRequired,
    header: PropTypes.oneOf(['show', 'hide']),
    height: PropTypes.string,
    host: PropTypes.string,
    ssl: PropTypes.bool,
    userName: PropTypes.string.isRequired
};

Wufoo.defaultProps = {
    async: true,
    autoResize: true,
    embedJs: '/scripts/embed/form.js',
    defaultValues: '',
    formHash: '',
    header: 'show',
    height: '0',
    host: 'wufoo.com',
    ssl: true,
    userName: ''
};

export default Wufoo;
