import ModernTemplate from './ModernTemplate'
import MinimalTemplate from './MinimalTemplate'
import CreativeTemplate from './CreativeTemplate'
import ExecutiveTemplate from './ExecutiveTemplate'
import CompactTemplate from './CompactTemplate'
import ClassicTemplate from './ClassicTemplate'

export const TEMPLATE_MAP = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  compact: CompactTemplate,
  classic: ClassicTemplate,
}

export const getTemplate = (templateId) => {
  return TEMPLATE_MAP[templateId] || ModernTemplate
}

export {
  ModernTemplate,
  MinimalTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
  CompactTemplate,
  ClassicTemplate,
}