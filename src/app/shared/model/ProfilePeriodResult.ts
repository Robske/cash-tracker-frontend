import { KeyValue } from "@angular/common";

export interface ProfilePeriodResult {
	userId: string;
	months: KeyValue<string, number>[];
	years: KeyValue<string, number>[];
}
