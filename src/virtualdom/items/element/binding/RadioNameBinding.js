import Binding from './Binding';
import { removeFromArray } from 'utils/array';
import getBindingGroup from './getBindingGroup';
import handleDomEvent from './handleDomEvent';

function getGroupValue () {
	let i = this.bindings.length;
	while ( i-- ) {
		const binding = this.bindings[i];
		if ( binding.node.checked ) return binding.element.getAttribute( 'value' );
	}
}

export default class RadioNameBinding extends Binding {
	constructor ( element ) {
		super( element, 'name' );

		this.group = getBindingGroup( this.ractive._guid, 'radioname', this.model, getGroupValue );
		this.group.add( this );
	}

	bind () {
		if ( !this.group.bound ) {
			this.group.bind();
		}
	}

	getInitialValue () {
		if ( this.element.getAttribute( 'checked' ) ) {
			return this.element.getAttribute( 'value' );
		}
	}

	getValue () {
		return this.element.getAttribute( 'value' );
	}

	handleChange () {
		// If this <input> is the one that's checked, then the value of its
		// `name` model gets set to its value
		if ( this.node.checked ) {
			super.handleChange();
		}
	}

	// TODO still necessary?
	rebound ( oldKeypath, newKeypath ) {
		super.rebound( oldKeypath, newKeypath );

		if ( this.rendered ) {
			this.node.name = '{{' + this.model.getKeypath() + '}}';
		}
	}

	render () {
		super.render();

		const node = this.node;

		node.name = '{{' + this.model.getKeypath() + '}}';
		node.checked = this.model.value == this.element.getAttribute( 'value' );

		node.addEventListener( 'change', handleDomEvent, false );

		if ( node.attachEvent ) {
			node.addEventListener( 'click', handleDomEvent, false );
		}
	}

	unbind () {
		this.group.remove( this );
	}

	unrender () {
		var node = this.node;

		node.removeEventListener( 'change', handleDomEvent, false );
		node.removeEventListener( 'click', handleDomEvent, false );
	}
}
