/* Hello! custom-text-input-element.js is a custom text input HTML Element mini-library by Xavior Pautin
   that creates a modern text input web component.
   Version 2.0;
   28 Apr. 2020;
*/

const textInputTemplate = document.createElement('text-input-template');
textInputTemplate.innerHTML =
`
<div class="text-input-container">
    <style>
    /** Input container */
    .text-input-container {
        width: 100%;
        height: 50px; /* Determines where the input-label will be */
        position: relative; /* Necessary because its child elements are using relative properties like bottom: 0; */
        overflow: hidden; /* Hides the animated bits that spill out the main container */
        
        /* Default CSS Variables */
        --bluish-black: #172B4D;
        --blue: #2E90FF;
        --grey6: #767676;

        --text-color: var(--bluish-black);
        --accent-color: var(--blue);
        --placeholder-color: var(--grey6);
        --font-size: 18px;
        --label-size: 18px;
        --animation-duration: 0.3s;
    }
    .text-input-container * {
        font-family: 'Montserrat', sans-serif; /* Optional */
        font-weight: 400; /* Optional */
        font-size: var(--font-size); /* Optional */
        color: var(--text-color); /* Optional */
        margin: 0;
        padding: 0;
    }

    /** Input Field */
    .text-input-container .input {
        box-sizing: border-box; /* Prevents the input box from exceeding the size of its parent container */
        width: 100%;
        position: absolute;
        bottom: 0;
        
        outline: none;
        border: none;
        padding-bottom: 4px; /* Better-looking line spacing */
    }

    /** Input Label */
    /* label-container allows the input-label to be moved relative to the main container's height */
    .text-input-container .label-container {
        position: absolute;
        pointer-events: none;
        width: 100%;
        height: 100%;
        margin: 0;
        transform: none;
        transition: transform var(--animation-duration) ease;
    }
    /* Move label-container up when focused OR when there is text left in the input */
    .text-input-container .input:focus ~ .label-container,
    .text-input-container .input:not(:placeholder-shown) ~ .label-container {
        transform: translateY(-100%);
    }

    /* The input-label */
    .text-input-container .input-label {
        display: inline-block;
        pointer-events: none; /* Allows user to click the input by clicking through the label */
        font-size: var(--font-size); /* Optional */
        color: var(--placeholder-color); /* Optional */

        position: absolute;
        bottom: 0;
        transform: none; /* Normal state */
        transition: all var(--animation-duration) ease;
    }

    /* Move input-label up when focused OR when there is text left in the input */
    .text-input-container .input:focus ~ .label-container .input-label,
    .text-input-container .input:not(:placeholder-shown) ~ .label-container .input-label {
        transform: translateY(100%); /* Bring label down by 100% of its height, therefore, aligning its top edge with the top edge of the main container */
        font-size: var(--label-size); /* Optional */
        color: var(--accent-color); /* Optional */
    }

    /* input-underline */
    .text-input-container .input-underline {
        pointer-events: none; /* Allows user to click the input by clicking through the underline div */
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        border-bottom: 1px solid var(--text-color);
    }
    .text-input-container .input-underline::after {
        /* Final input-underline */
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        bottom: -1px; /* Places line directly on top of other line by accounting for the border's thickness */
        border-bottom: 2px solid var(--accent-color);

        /* Initial input-underline */
        transform: translateX(-100%);
        transition: transform var(--animation-duration) ease;
    }
    /* Trigger input-underline animation*/
    .text-input-container .input:focus ~ .input-underline:after,
    .text-input-container .input:not(:placeholder-shown) ~ .input-underline:after {
        transform: none; /* Animates highlighted underline back to its position on top of the normal underline */
    }
    </style>

    <input class="input" type="text" placeholder=" " autocomplete="off">
    <div class="input-underline"></div>
    <div class="label-container">
        <span class="input-label">Name</span>
    </div>

</div>
`;

//? <text-input> Attribute List
// INHERITED:
// id
// class
// type
// value
// auto-focus
// readonly

// CUSTOM:
// label
// height
// animation-duration
// font-size
// label-size
// text-color
// accent-color
// placeholder-color

class textInput extends HTMLElement {

    static get observedAttributes() {
        return ['readonly'];
    }
    
    constructor () {
        super();
        
        // Import font into document
        const montserrat = document.createElement("link"); 
        montserrat.type = "text/css"; 
        montserrat.rel = "stylesheet"; 
        montserrat.href = "//fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800";
        document.head.appendChild(montserrat);
        
        // Attach shadow root and insert HTML template
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(textInputTemplate.querySelector('.text-input-container').cloneNode(true));
        
        // Element references
        this.containerElement = this.shadowRoot.querySelector('.text-input-container');
        this.inputElement = this.shadowRoot.querySelector('.input');
        this.labelElement = this.shadowRoot.querySelector('.input-label');
        
        //? this.Defaults in version 2.1?
        // const Defaults = {
        //         fontSize: '1.1em',
        //         labelFontSize: '1.1em',
        //         ...
        // };
            
    } // End of constructor()
    
    connectedCallback () {
        // TODO: TEST ALL OF THE ATTRIBUTES
        //* INHERITED ATTRIBUTES
        // id attribute inherited from super();
        
        // class attribute inherited from super();
        
        // type attribute transferred from <input> to the <input> child element inside it
        if ( this.has(this.getAttribute('type')) ) this.inputElement.setAttribute('type', this.getAttribute('type') );
        
        // value attribute transferred from <input> to the <input> child element inside it
        // Note: This is the value ATTRIBUTE which only sets the INITIAL value of the input field. If you would like to
        // change the contents of the field AFTER the user has typed into it, then use the .changeValue() method
        if ( this.has(this.getAttribute('value')) ) this.inputElement.setAttribute('value', this.getAttribute('value') );
        
        // auto-focus attribute
        if ( this.has(this.getAttribute('auto-focus')) || this.getAttribute('auto-focus') == '') {
            this.inputElement.focus();
        }
        
        // readonly attribute
        if ( this.has(this.getAttribute('readonly')) || this.getAttribute('readonly') == '') {
            this.inputElement.setAttribute('readonly', this.getAttribute('readonly') );
        }
        
        //* CUSTOM ATTRIBUTES
        // label attribute
        this.labelElement.textContent = ( this.has(this.getAttribute('label')) ) ? this.getAttribute('label') : 'Name';
        
        // height attribute
        if ( this.has(this.getAttribute('height')) ) {
            // Allow the user to input the number followed by the unit or just the number and it will default to px
            // Note: Currently, the height attribute does not support percentages
            let height = this.getAttribute('height');
            if (!isNaN(height)) height = height + 'px';
            this.containerElement.style.setProperty('height', height);
        }
        
        // animation-duration attribute
        if ( this.has(this.getAttribute('animation-duration')) ) {
            // Allow the user to input the number followed by the unit or just the number
            let duration = parseFloat( this.getAttribute('animation-duration') ) + 's';
            this.containerElement.style.setProperty('--animation-duration', duration);

            // Example: <text-input animation-duration="1.5s">
            // AND <text-input animation-duration="1.5"> BOTH WORK!
        }

        // font-size attribute
        if ( this.has(this.getAttribute('font-size')) ) {
            // Allow the user to input the number followed by the unit or just the number
            let size = parseFloat( this.getAttribute('font-size') ) + 'px';
            this.containerElement.style.setProperty('--font-size', size);
        }

        // label-size attribute
        if ( this.has(this.getAttribute('label-size')) ) {
            // Allow the user to input the number followed by the unit or just the number
            let size = parseFloat( this.getAttribute('label-size') ) + 'px';
            this.containerElement.style.setProperty('--label-size', size);
        }        
        // text-color attribute
        if ( this.has(this.getAttribute('text-color')) ) this.containerElement.style.setProperty('--text-color', this.getAttribute('text-color') );
        
        // accent-color attribute
        if ( this.has(this.getAttribute('accent-color')) ) this.containerElement.style.setProperty('--accent-color', this.getAttribute('accent-color') );
        
        // placeholder-color attribute
        if ( this.has(this.getAttribute('placeholder-color')) ) this.containerElement.style.setProperty('--placeholder-color', this.getAttribute('placeholder-color') );
        
        //? Feature request: addEventListener for a "clear input field" button inside the input box

    } // End of connectedCallback()
    
    disconnectedCallback () {
        //? Feature request continued: removeEventListener for a "clear input field" button inside the input box
        
    } // End of disconnectedCallback()

    attributeChangedCallback(attribute, oldValue, newValue) {
        // Updatable attributes: readonly
        if (attribute == 'readonly') this.inputElement.toggleAttribute('readonly');
        
    } // End of attributeChangedCallback()
    
    // Functions
    has(_attribute) {
        if ( typeof(_attribute) !== "undefined" && _attribute !== null && _attribute != "" ) return true;
        else return false;
    }
    isFocused (element) {
        return ( document.activeElement === element.shadowRoot.querySelector('.input') );
    }
    changeValue(_value) {
        this.inputElement.value = _value;
    }
    
}
window.customElements.define('text-input', textInput);

// Fill Fields btn
document.getElementById('btn1').addEventListener('click', () => {
    Array.from(document.getElementsByTagName('text-input')).forEach(element => {
        element.changeValue('John Doe');
    });
});

// Clear All Fields btn
document.getElementById('btn2').addEventListener('click', () => {
    Array.from(document.getElementsByTagName('text-input')).forEach(element => {
        element.changeValue('');
    });

});
document.getElementById('btn3').addEventListener('click', () => {
    document.getElementById('input1').changeValue('This Field Is Read Only');
    document.getElementById('input1').toggleAttribute('readonly');

});