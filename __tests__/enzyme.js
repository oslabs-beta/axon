import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Enzyme is a wrapper around React test utilities which makes it easier to
// shallow render and traverse the shallow rendered tree.
import RootComponent from '../src/app/app';
import FileImport from '../src/app/components/fileImport';
import FileExport from '../src/app/components/fileExport';

// Newer Enzyme versions require an adapter to a particular version of React
configure({ adapter: new Adapter() });


// describe block for all React tests, we have 3 components
describe('React unit tests', () => {
  describe('RootComponent', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<RootComponent />);
    });

    it('renders', () => {
      console.log(wrapper.debug());
      expect(wrapper).not.toBeNull();
    });
  });
  
  describe('FileImport', () => {
    let wrapper;
    const onFileUpload = jest.fn();
    beforeEach(() => {
      wrapper = shallow(<FileImport onChange={onFileUpload} id='fileURL' />);
    });

    it('renders', () => {
      expect(wrapper).not.toBeNull();
    });
  });
      
  describe('FileExport', () => {
    let wrapper;
    const onDownload = jest.fn();
    beforeEach(() => {
      wrapper = shallow(<FileExport onClick={onDownload}/>);
    });

    it('renders', () => {
      expect(wrapper).not.toBeNull();
    });
  });

});
        