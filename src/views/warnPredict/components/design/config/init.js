import { uuid } from '@/common/js/tool/toolsMap.js';
import { deepClone } from '@/common/js/border/util.js';

export const nodeData = {
  binding: '',
  lineObjList: [],
  nodeData: {
    nodeId: ''
  },
  nodeVariable: [],
  paramObjList: [],
  top: '',
  left: ''
};

const nodeTypeList = [
  {
    category: '输入输出',
    list: [
      {
        type: 'START',
        typeName: '开始节点',
        name: '开始节点',
        data: {
          ...deepClone(nodeData)
        }
      },
      {
        type: 'END',
        typeName: '结束节点',
        name: '结束节点',
        data: {
          ...deepClone(nodeData)
        }
      }
    ]
  },
  {
    category: '流程节点',
    list: [
      {
        type: 'JUDGE',
        typeName: '条件分支',
        name: '条件分支',
        data: {
          ...deepClone(nodeData)
        }
      },
      {
        type: 'RULES',
        typeName: '规则节点',
        name: '规则节点',
        data: {
          ...deepClone(nodeData)
        }
      },
      {
        type: 'VARIABLE',
        typeName: '计算节点',
        name: '计算节点',
        data: {
          ...deepClone(nodeData)
        }
      },
      {
        type: 'ASSIGNMENT',
        typeName: '赋值节点',
        name: '赋值节点',
        data: {
          ...deepClone(nodeData)
        }
      },
      {
        type: 'SCORE',
        typeName: '评分卡',
        name: '评分卡',
        data: {
          ...deepClone(nodeData)
        }
      }
    ]
  }
];
const judgmentList = [
  {
    label: '等于',
    value: 'eq'
  },
  {
    label: '不等于',
    value: 'ne'
  },

  {
    label: '包含',
    value: 'like'
  },
  {
    label: '不包含',
    value: 'NotLike'
  },
  {
    label: '大于',
    value: 'gt'
  },
  {
    label: '大于等于',
    value: 'ge'
  },
  {
    label: '小于',
    value: 'lt'
  },
  {
    label: '小于等于',
    value: 'le'
  },
  {
    label: '介于 范围',
    value: 'between'
  },
  {
    label: '不介于 范围外',
    value: 'noBetween'
  },
  {
    label: '不为空',
    value: 'notEmpty'
  },
  {
    label: '为空',
    value: 'empty'
  }
];

const logicalList = [
  {
    label: '且',
    value: '&'
  },
  {
    label: '或',
    value: '|'
  }
];
const dataTypeList = [
  {
    label: '固定值',
    value: 'data'
  },
  {
    label: '变量',
    value: 'var'
  }
];

const paramObj = {
  relationshipNo: uuid().generate(),
  no: undefined,
  text: null,
  type: 'variable',
  remark: '',
  value1: undefined,
  value2: undefined,
  indexNo: 1,
  dataType: 'data',
  judgment: undefined,
  operator: '&',
  methodValue: [],
  arrValue: ''
};
const operatorList = [
  { label: '加', value: 'add' },
  { label: '减', value: 'sub' },
  { label: '乘', value: 'mul' },
  { label: '除', value: 'div' }
];

const scoreObj = {
  presetSettings: '',
  fraction: '',
  value1: '',
  value2: '',
  rangeType: '1',
  visible: false
};

export { nodeTypeList, operatorList, judgmentList, dataTypeList, logicalList, paramObj, scoreObj };
