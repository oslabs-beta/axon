import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import toJson from 'enzyme-to-json';

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

    // it('have a logo in header', () => {
    //   expect(wrapper)
    // }
  });
  
  // TODO: Test the following:
  // 1. RootComponent should contain a main tag with a header and div body, id contentbox
  // 2. Header should be an image (logo)
  // 3. div contentbox should render a 3 divs, id of `progressDisplay`, 'import', 'bottom box'
  
  describe('FileImport', () => {
    let wrapper;
    const onFileUpload = jest.fn();
    beforeEach(() => {
      wrapper = shallow(<FileImport onChange={onFileUpload} id='fileURL' />);
    });

    it('renders', () => {
      // console.log(wrapper.debug());
      expect(wrapper).not.toBeNull();
    });

    // TODO: Test the following:
    // 1. 
    // 2. 
    // 3. 

  });
      
  describe('FileExport', () => {
    let wrapper;
    const onDownload = jest.fn();
    beforeEach(() => {
      wrapper = shallow(<FileExport onClick={onDownload}/>);
    });

    it('renders', () => {
      // console.log(wrapper.debug());
      expect(wrapper).not.toBeNull();
    });

    // TODO: Test the following:
    // 1. 
    // 2. 
    // 3. 

  });

});
        