import { Inputs, Outputs, CloudWatchLoggingOptions } from "aws-sdk/clients/kinesisanalytics";

export interface IKinesisAppConfig {
    inputs?: Inputs, 
    outputs?: Outputs, 
    cloudWatchLoggingOptions?: CloudWatchLoggingOptions
}