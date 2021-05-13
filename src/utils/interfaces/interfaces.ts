
// String Configuration Object that is passed into the constructor functions of the StringBuilder and SuperTestCodeBuilder
export interface StringConfiguration {
    autoNewLine?: boolean,
    autoSpacing?: boolean,
    indentationAmount?: number
}

// Interface for an object that contains data from an endpoint array
export interface EndpointInformation {
    statusCode?: number | string,
    route?: string,
    contentType?: string
}