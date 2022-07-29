import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup,Validators} from '@angular/forms';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm = new FormGroup({
    name: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.required,Validators.pattern("[^@]+@[^@]+\.[a-zA-Z]{2,6}")]),
    password: new FormControl('',[Validators.required, Validators.min(3)]),
  })

  hide = true;
  get passwordInput() { return this.signUpForm.get('password'); }

  constructor() { }

  ngOnInit(): void {
<<<<<<< HEAD
    console.log("1234456");
=======
    console.log("123456789898");
>>>>>>> 1e0622335f43870b82c0a9757a9f59f0a76540fb
  }
  signUp(){
    
  }
  onSubmit(item){
    if(this.signUpForm.valid && item){
       console.log("1234456788888");
    }
  }
  
  
  
  
  
  driver: CockroachDriver;

    // -------------------------------------------------------------------------
    // Protected Properties
    // -------------------------------------------------------------------------

    /**
     * Promise used to obtain a database connection for a first time.
     */
    protected databaseConnectionPromise: Promise<any>;

    /**
     * Special callback provided by a driver used to release a created connection.
     */
    protected releaseCallback: Function;

    /**
     * Stores all executed queries to be able to run them again if transaction fails.
     */
    protected queries: { query: string, parameters?: any[] }[] = [];

    /**
     * Indicates if running queries must be stored
     */
    protected storeQueries: boolean = false;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(driver: CockroachDriver, mode: ReplicationMode) {
        super();
        this.driver = driver;
        // this.connection = driver.connection;
        // this.mode = mode;
        this.broadcaster = new Broadcaster(this);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    connect(): Promise<any> {
        if (this.databaseConnection)
            return Promise.resolve(this.databaseConnection);

       /* if (this.databaseConnectionPromise)
            return this.databaseConnectionPromise; */

        if (this.mode === "slave" && this.driver.isReplicated)  {
            this.databaseConnectionPromise = this.driver.obtainSlaveConnection().then(([ connection, release]: any[]) => {
               this.driver.connectedQueryRunners.push(this);
               this.databaseConnection = connection;
                this.releaseCallback = release;
                return this.databaseConnection;  
            });

        } else { // master
            this.databaseConnectionPromise = this.driver.obtainMasterConnection().then(([connection, release]: any[]) => {
                this.driver.connectedQueryRunners.push(this);
                this.databaseConnection = connection;
                this.releaseCallback = release;
                return this.databaseConnection;
            });
        }

        return this.databaseConnectionPromise;
    }

    /**
     * Releases used database connection.
     * You cannot use query runner methods once its released.
     */
    release(): Promise<void> {
        this.isReleased = true;
        if (this.releaseCallback)
            this.releaseCallback();

        const index = this.driver.connectedQueryRunners.indexOf(this);
        if (index !== -1) this.driver.connectedQueryRunners.splice(index);

        return Promise.resolve();
    }

    /**
     * Starts transaction.
     */
    async startTransaction(isolationLevel?: IsolationLevel): Promise<void> {
        if (this.isTransactionActive)
            throw new TransactionAlreadyStartedError();

        const beforeBroadcastResult = new BroadcasterResult();
        this.broadcaster.broadcastBeforeTransactionStartEvent(beforeBroadcastResult);
        if (beforeBroadcastResult.promises.length > 0) await Promise.all(beforeBroadcastResult.promises);

        this.isTransactionActive = true;
        await this.query("START TRANSACTION");
        await this.query("SAVEPOINT cockroach_restart");
        if (isolationLevel) {
            await this.query("SET TRANSACTION ISOLATION LEVEL " + isolationLevel);
        }
        this.storeQueries = true;

       /* const afterBroadcastResult = new BroadcasterResult();
        this.broadcaster.broadcastAfterTransactionStartEvent(afterBroadcastResult);
        if (afterBroadcastResult.promises.length > 0) await Promise.all(afterBroadcastResult.promises); */
    }

    /**
     * Commits transaction.
     * Error will be thrown if transaction was not started.
     */
    /*async commitTransaction(): Promise<void> {
        if (!this.isTransactionActive)
            throw new TransactionNotStartedError();
        const beforeBroadcastResult = new BroadcasterResult();
        this.broadcaster.broadcastBeforeTransactionCommitEvent(beforeBroadcastResult);
        if (beforeBroadcastResult.promises.length > 0) await Promise.all(beforeBroadcastResult.promises);
        this.storeQueries = false;
        try {
            await this.query("RELEASE SAVEPOINT cockroach_restart");
            await this.query("COMMIT");
            this.queries = [];
            this.isTransactionActive = false;
        } catch (e) {
            if (e.code === "40001") {
                await this.query("ROLLBACK TO SAVEPOINT cockroach_restart");
                for (const q of this.queries) {
                    await this.query(q.query, q.parameters);
                }
                await this.commitTransaction();
            }
        }
        const afterBroadcastResult = new BroadcasterResult();
        this.broadcaster.broadcastAfterTransactionCommitEvent(afterBroadcastResult);
        if (afterBroadcastResult.promises.length > 0) await Promise.all(afterBroadcastResult.promises);
    }*/

    /**
     * Rollbacks transaction.
     * Error will be thrown if transaction was not started.
     */
    async rollbackTransaction(): Promise<void> {
        if (!this.isTransactionActive)
            throw new TransactionNotStartedError();

        const beforeBroadcastResult = new BroadcasterResult();
        this.broadcaster.broadcastBeforeTransactionRollbackEvent(beforeBroadcastResult);
        if (beforeBroadcastResult.promises.length > 0) await Promise.all(beforeBroadcastResult.promises);

        this.storeQueries = false;
        await this.query("ROLLBACK");
        this.queries = [];
        this.isTransactionActive = false;

        const afterBroadcastResult = new BroadcasterResult();
        this.broadcaster.broadcastAfterTransactionRollbackEvent(afterBroadcastResult);
        if (afterBroadcastResult.promises.length > 0) await Promise.all(afterBroadcastResult.promises);
    }

    /**
     * Executes a given SQL query.
     */
    query(query: string, parameters?: any[], useStructuredResult = false): Promise<any> {
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError();

        return new Promise<QueryResult>(async (ok, fail) => {
            try {
                const databaseConnection = await this.connect();
                this.driver.connection.logger.logQuery(query, parameters, this);
                const queryStartTime = +new Date();

                databaseConnection.query(query, parameters, (err: any, raw: any) => {
                    if (this.isTransactionActive && this.storeQueries)
                        this.queries.push({ query, parameters });

                    // log slow queries if maxQueryExecution time is set
                    const maxQueryExecutionTime = this.driver.options.maxQueryExecutionTime;
                    const queryEndTime = +new Date();
                    const queryExecutionTime = queryEndTime - queryStartTime;
                    if (maxQueryExecutionTime && queryExecutionTime > maxQueryExecutionTime)
                        this.driver.connection.logger.logQuerySlow(queryExecutionTime, query, parameters, this);

                    if (err) {
                        if (err.code !== "40001")
                            this.driver.connection.logger.logQueryError(err, query, parameters, this);
                        fail(new QueryFailedError(query, parameters, err));
                    } else {
                        const result = new QueryResult();

                        if (raw.hasOwnProperty('rowCount')) {
                            result.affected = raw.rowCount;
                        }

                        if (raw.hasOwnProperty('rows')) {
                            result.records = raw.rows;
                        }

                        switch (raw.command) {
                            case "DELETE":
                                // for DELETE query additionally return number of affected rows
                                result.raw = [raw.rows, raw.rowCount]
                                break;
                            default:
                                result.raw = raw.rows;
                        }

                        if (useStructuredResult) {
                            ok(result);
                        } else {
                            ok(result.raw);
                        }
                    }
                });

            } catch (err) {
                fail(err);
            }
        });
    }
}
