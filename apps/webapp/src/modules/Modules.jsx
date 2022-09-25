import FSAModule from './fsa2/FSAModule';
import PDAModule from './pda/PDAModule';
import REModule from './re/REModule';
import NodeGraphModule from './nodegraph/NodeGraphModule';

const Modules = {};

Modules['fsa'] = {
  name: 'Finite Automata',
  version: '3.0.0',
  experimental: true,
  fetch: function (callback) {
    callback(FSAModule);
  },
};

Modules['pda'] = {
  name: 'Pushdown Automata',
  version: '1.0.0',
  experimental: true,
  fetch: function (callback) {
    callback(PDAModule);
  },
};

Modules['re'] = {
  name: 'Regular Expression',
  version: '1.0.0',
  experimental: true,
  fetch: function (callback) {
    callback(REModule);
  },
};

Modules['tm'] = {
  name: 'Turing Machine',
  version: '1.0.0',
  disabled: true,
  fetch: function (callback) {
    throw new Error('Module not yet implemented. Sorry :(');
  },
};

Modules['node'] = {
  name: 'Node Graph',
  version: '1.0.0',
  experimental: true,
  fetch: function (callback) {
    callback(NodeGraphModule);
  },
};

Modules['tree'] = {
  name: 'Tree',
  version: '1.0.0',
  disabled: true,
  fetch: function (callback) {
    throw new Error('Module not yet implemented. Sorry :(');
  },
};

Modules['hlsm'] = {
  name: 'High Level State Machine',
  version: '1.0.0',
  disabled: true,
  fetch: function (callback) {
    throw new Error('Module not yet implemented. Sorry :(');
  },
};

Modules['mealy'] = {
  name: 'Mealy Machine',
  version: '1.0.0',
  disabled: true,
  fetch: function (callback) {
    throw new Error('Module not yet implemented. Sorry :(');
  },
};

Modules['moore'] = {
  name: 'Moore Machine',
  version: '1.0.0',
  disabled: true,
  fetch: function (callback) {
    throw new Error('Module not yet implemented. Sorry :(');
  },
};

export default Modules;
