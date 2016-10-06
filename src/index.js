import React, {Component} from 'react';
import {render} from 'react-dom';

const {dialog} = require('electron').remote;
const fs = require('fs');
const csv = require('csv-parser');
const _ = require('lodash');

import {Table, Column, Cell} from 'fixed-data-table';

class App extends Component {
    constructor() {
        super();
        this.state = {
            entries: [{one: 'one', b: 't'}, {one: 'two', b: 'e'}],
        };
    }

    handleButtonClick () {
        let files = dialog.showOpenDialog({properties: ['openFile']});

        let rows = [];

        if (files && files.length) {
            fs.createReadStream(files[0])
                .pipe(csv())
                .on('data', data => {
                    rows.push(data);

                    if (rows.length > 100) {
                        let entries = this.state.entries;
                        entries.push(...rows);
                        this.setState({entries: entries})
                        rows = [];
                    } else {

                    }
                });
        }
    }

    render() {
        let rows = _.map(this.state.entries, entry => _.values(entry));

        return (
            <div>
                <button onClick={this.handleButtonClick.bind(this)}>Select file</button>
                <Table
                rowHeight={30}
                rowsCount={rows.length}
                width={window.innerWidth - 10}
                height={window.innerHeight - 50}
                headerHeight={30}>
                <Column
                    header={<Cell>Col 1</Cell>}
                    cell={<Cell>Column 1 static content</Cell>}
                    width={200}
                />
                <Column
                    header={<Cell>Col 2</Cell>}
                    cell={({rowIndex}) => (
                        <Cell>
                            Index: {rowIndex} Data for column2: {rows[rowIndex][1]}
                        </Cell>
                    )}
                    width={1000}
                />
                </Table>
            </div>
        )

    }
}

render(<App/>, document.getElementById('app'));
