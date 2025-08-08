export type ExpeditionRecordContact = {
    /**
     * Who scanned this node
     */
    name: string;
    /**
     * Who (phone number) scanned this node
     */
    phone?: string;
}

export type ExpeditionRecord = {
    /**
     * Record node description
     */
    description?: string;
    
    /**
     * Expedition record destination (e.g. Mantikulore DC)
     */
    destination: string;
    /**
     * When this record created
     * @type {number} JS Date Number (UNIX)
     */
    time: number;

    /**
     * Expected next record from current node
     */
    next?: ExpeditionRecord;

    /**
     * If exist (person contact who scanned this record)
     */
    contact?: ExpeditionRecordContact;
}

export type ExpeditionResult = {
    /**
     * Expedition name (e.g. SPX, J&T, JNE, Tiki)
     */
    expedition: string;
    /**
     * Expedition records
     */
    records: Array<ExpeditionRecord>;
}