import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import getAuthToken from '../components/modules/get_auth_token';
import LoadingIndicator from '../components/shared/loading_indicator'

export default class CmsSchoolIndex extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: this.getColumns(),
      data: props.queryResults,
      query: props.query,
      loading: false
    }

    this.setSort = this.setSort.bind(this)
    this.search = this.search.bind(this)
    this.updatePage = this.updatePage.bind(this)
    this.updateCheckbox = this.updateCheckbox.bind(this)
    this.submitPageForm = this.submitPageForm.bind(this)
    this.updatePremiumStatus = this.updatePremiumStatus.bind(this)
  }

  getColumns() {
      return [
        {
          Header: 'Name',
          accessor: 'school_name',
          resizable: false,
          minWidth: 140,
          Cell: row => row.original.school_name
        }, {
          Header: "District",
          accessor: 'district_name',
          resizable: false,
          minWidth: 140,
          Cell: row => row.original.district_name
        }, {
          Header: "City",
          accessor: 'school_city',
          minWidth: 140,
          resizable: false,
          Cell: row => row.original.school_city
        }, {
          Header: "State",
          accessor: 'school_state',
          resizable: false,
          minWidth: 60,
          Cell: row => row.original.school_state,
        }, {
          Header: 'ZIP',
          accessor: 'school_zip',
          resizable: false,
          minWidth: 60,
          Cell: row => Number(row.original.school_zip),
        }, {
          Header: "FRL",
          accessor: 'frl',
          resizable: false,
          minWidth: 60,
          Cell: row => `${row.original.frl}%`,
        }, {
          Header: "Teachers",
          accessor: 'number_teachers',
          resizable: false,
          minWidth: 80,
          Cell: row => Number(row.original.number_teachers),
        }, {
          Header: "Premium?",
          accessor: 'premium_status',
          resizable: false,
          minWidth: 90,
          Cell: row => row.original.premium_status,
        }, {
          Header: "Admins",
          accessor: 'number_admins',
          resizable: false,
          minWidth: 80,
          Cell: row => Number(row.original.number_admins),
        }, {
          Header: "Edit",
          accessor: 'edit',
          resizable: false,
          minWidth: 60,
          Cell: (row) => {
            return <a href={`${process.env.DEFAULT_URL}/cms/schools/${row.original.id}`}>Edit</a>
          }
        }
      ];
  }

  setSort(newSorted) {
    const sort = newSorted[0].id
    const sort_direction = newSorted[0].desc ? 'desc' : 'asc'
    if (sort !== this.state.query.sort || sort_direction !== this.state.query.sort_direction) {
      const newState = { ...this.state}
      newState.query.sort = sort
      newState.query.sort_direction = sort_direction
      this.setState(newState, this.search)
    }
  }

  updateField(e, key) {
    const value = e.target.value
    const newState = { ...this.state}
    newState.query[key] = value
    this.setState(newState)
  }

  updateCheckbox() {
    const newState = { ...this.state}
    newState.query.search_schools_with_zero_teachers = !this.state.query.search_schools_with_zero_teachers
    this.setState(newState)
  }

  updatePage(i) {
    const newState = { ...this.state}
    newState.query.page = i
    this.setState(newState, this.search)
  }

  submitPageForm(e) {
    this.updatePage(e.target.page.value)
  }

  updatePremiumStatus(e) {
    const selectedOptions = []
    Array.from(e.target.options).forEach(o => {
      if (o.selected) {
        selectedOptions.push(o.value)
      }
    })
    const newState = { ...this.state }
    newState.query.premium_status = selectedOptions
    this.setState(newState)
  }

  renderPremiumStatusSelect() {
    const options = this.props.schoolPremiumTypes.map(o => <option value={o}>{o}</option>)
    return <select multiple={true} onChange={this.updatePremiumStatus}>
      {options}
    </select>
  }

  renderPageSelector() {
    const currentPage = this.state.query.page || 1
    const totalPages = this.state.numberOfPages || 1
    return <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <a onClick={() => this.updatePage(1)}>First</a>
      <form onSubmit={this.submitPageForm}>
        <input defaultValue={currentPage} name='page'/><span>of {totalPages}</span>
      </form>
      <a onClick={() => this.updatePage(totalPages)}>Last</a>
    </div>
  }

  search() {
    this.setState({loading: true})
    const link = `${process.env.DEFAULT_URL}/cms/schools/search`
    const data = new FormData();
    Object.keys(this.state.query).forEach((k) => {
      data.append(k, this.state.query[k])
    })
    fetch(link, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: data,
      headers: {
        'X-CSRF-Token': getAuthToken()
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      this.setState({ data: response.schoolSearchQueryResults, numberOfPages: response.numberOfPages, loading: false })
    }).catch((error) => {
      console.log('error', error)
    })
  }

  renderTableOrLoading() {
    if (this.state.loading) {
      return <LoadingIndicator/>
    } else if (this.state.data && this.state.data.length) {
      const sort = this.state.query.sort ? this.state.query.sort : 'number_teachers'
      const sortDescending = this.state.query.sort_direction ? this.state.query.sort_direction === 'desc' : true
      return (<div>
        <ReactTable data={this.state.data}
        columns={this.state.columns}
        showPagination={false}
        defaultSorted={[{id: sort, desc: sortDescending}]}
        showPaginationTop={false}
        showPaginationBottom={false}
        showPageSizeOptions={false}
        defaultPageSize={100}
        minRows={1}
        className='progress-report activity-scores-table'
        onSortedChange={this.setSort}
      />
      <div className='cms-pagination-container'>
        {this.renderPageSelector()}
      </div>
    </div>)
  } else {
    return <p>No records found for your query.</p>
  }
  }

  render() {
    return (<div>
      <div className='cms-form'>
        <div className='cms-meta-middle'>
          <div className='cms-form-row'>
            <label>School Name</label>
            <input id='school_name' name='school_name' value={this.state.query.school_name} onChange={e => this.updateField(e, 'school_name')}/>
          </div>

          <div className='cms-form-row'>
            <label>City</label>
            <input id='school_city' name='school_city' value={this.state.query.school_city} onChange={e => this.updateField(e, 'school_city')}/>
          </div>

            <div className='cms-form-row'>
            <label>State</label>
            <input id='school_state' name='school_state' value={this.state.query.school_state} onChange={e => this.updateField(e, 'school_state')}/>
          </div>

            <div className='cms-form-row'>
            <label>Zip</label>
            <input id='school_zip' name='school_zip' value={this.state.query.school_zip} onChange={e => this.updateField(e, 'school_zip')}/>
          </div>

          <div className='cms-form-row'>
            <label>District Name</label>
            <input id='district_name' name='district_name' value={this.state.query.district_name} onChange={e => this.updateField(e, 'district_name')}/>
          </div>
        </div>

        <div className='cms-meta-right'>
          <div className='cms-form-row'>
            <label>Premium Status</label>
            {this.renderPremiumStatusSelect()}
          </div>

          <div className='cms-form-row cms-checkbox-row'>
            <label>Include Schools with 0 Teachers</label>
            <input
              type="checkbox"
              name="search_schools_with_zero_teachers"
              id="search_schools_with_zero_teachers"
              checked={this.state.query.search_schools_with_zero_teachers}
              onChange={this.updateCheckbox}
            />
          </div>

          <div className='cms-submit-row'>
            <input onClick={this.search} type="submit" value="Submit" />
          </div>
        </div>
      </div>
      {this.renderTableOrLoading()}
    </div>)
  }
}
