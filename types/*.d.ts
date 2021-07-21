interface Dictionary{
  [index:string]:string
}

interface BoolDictionary{
  [index:string]:boolean
}

interface NamedInterface{
  name:string
}

interface UrlProp{
  raw:string,
  host:string[],
  port:string,
  path?:string[],
}

interface RequestProp{
  method: string,
	header: string[],
	url: UrlProp,
}

interface RequestObject extends NamedInterface{
  request: RequestProp,
	response: string[],
}

interface PostmanInfo extends NamedInterface{
  schema: string,
}

interface PostmanEventScript{
  type: string,
  exec: string[],
}

interface PostmanEvent{
  listen: string,
  script: PostmanEventScript,
}

interface PostmanVariable{
  key:string,
  value:string,
}

interface PostmanCollection{
  info: PostmanInfo,
  item: RequestObject[],
  event: PostmanEvent[],
  variable: PostmanVariable[],
}

type AllRouters = string[][];

interface RoutersObject{
  [parentRoute:string]:AllRouters;
}

type Endpoint = string | TestParams;
type EndpointArray = Array<Endpoint>;
type AllEndpoints = Array<EndpointArray>;

interface EndpointObject{
  [endpointPath:string]:AllEndpoints;
}

interface ImportObject{
  [importLabel:string]:string
}

interface FileObject extends NamedInterface{
  imports: Partial<ImportObject>,
  endpoints: Partial<EndpointObject>,
  routers:Partial<RoutersObject>,
}

type PathObjectProp = FileObject | string | ReadResult;

interface PathObject{
  [filePath:string] : PathObjectProp,
}

interface TestParams{
  status?:string,
  'content-type'?:string,
}

interface ReadResult extends NamedInterface{
  text:string,
}

interface REMatch{
  [key:number]:Dictionary
}

interface FileWithPath extends File {
  webkitRelativePath: string,
}

interface ServerDirectory {
  [index:number]: FileWithPath,
  length: number,
}

interface StringConfiguration {
  autoNewLine?: boolean,
  autoSpacing?: boolean,
  indentationAmount?: number
}

interface EndpointInformation {
  statusCode?: number | string,
  route?: string,
  contentType?: string
}