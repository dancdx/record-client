import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import InputWithLabel from 'Gb/components/InputWithLabel'
import List from 'Gb/components/List'
import { CellsTitle } from 'react-weui'
import statisticActions from './actions'
import moment from 'moment'

import styles from './index.scss'

class StatisticComponent extends Component {
  constructor () {
    super()
    this.state = {
      startTime: '',
      endTime: ''
    }
    this.setSearchTime = this.setSearchTime.bind(this)
    this.getStatistic = this.getStatistic.bind(this)
    this.renderStatistic = this.renderStatistic.bind(this)
    this.renderMembers = this.renderMembers.bind(this)
    this.getTeamStatistic = this.getTeamStatistic.bind(this)
    this.renderTotalProfit = this.renderTotalProfit.bind(this)
  }

  // 设置时间
  setSearchTime (e) {
    const { name, value } = e.target
    this.setState({
      [name]: value
    }, this.getStatistic)
  }

  // 获取统计数据
  getStatistic () {
    const { role } = JSON.parse(localStorage.getItem('user'))
    const { startTime, endTime } = this.state
    const { fetchStatistic } = this.props.actions
    fetchStatistic && fetchStatistic({
      startTime: startTime ? startTime + ' 00:00:00' : startTime,
      endTime: endTime ? endTime + ' 23:59:59' : endTime
    })
    if (role === 2) {
      this.getTeamStatistic()
    }
  }

  // 获取团队统计数据
  getTeamStatistic () {
    const { startTime, endTime } = this.state
    const { fetchTeamStatistic } = this.props.actions
    fetchTeamStatistic && fetchTeamStatistic({
      startTime, endTime
    })
  }

  renderStatistic () {
    const { data } = this.props.statistic
    if (!data) return null
    const dataSource = [
      { title: '订单数量', desc: data.orderCount },
      { title: '商品总数', desc: data.goodsCount },
      { title: '订单金额', desc: data.total },
      { title: '利润', desc: data.totalProfit },
      { title: '商品详情', desc: data.goodsArr.map((item, index) => {
        return <span className={styles.statistic_goodsitem} key={index}>{item.name}({item.num})</span>
      }) }
    ]
    return <div className={styles.statistic_myorder}>
      <CellsTitle>我的统计</CellsTitle>
      <List dataSource={dataSource} />
    </div>
  }

  // 总代渲染团队成员
  renderMembers () {
    const { team } = this.props.statistic
    if (!team || team.length === 0) return null
    return <div className={styles.statistic_team}>
      <CellsTitle>团队统计</CellsTitle>
      <div>
      {
        team.map((item, index) => {
          return <span key={index} className={styles.statistic_team_item} onClick={() => { this.setState({ curTeam: item, activeIndex: index }) }}>{item.username}</span>
        })
      }
      </div>
      
    </div>
  }

  // 渲染团队成员统计
  renderTeamItem () {
    const { activeIndex } = this.state
    const { team } = this.props.statistic
    if (!team || !team.length || activeIndex === undefined) return null
    const data = team[activeIndex].statistic
    const dataSource = [
      { title: '订单数量', desc: data.orderCount },
      { title: '商品总数', desc: data.goodsCount },
      { title: '订单金额', desc: data.total },
      { title: '利润', desc: data.totalProfit },
      { title: '商品详情', desc: data.goodsArr.map((item, index) => {
        return <span className={styles.statistic_goodsitem} key={index}>{item.name}({item.num})</span>
      }) }
    ]
    return <div className={styles.statistic_myorder}>
      <CellsTitle>{team[activeIndex].username}统计</CellsTitle>
      <List dataSource={dataSource} />
    </div>
  }

  // 渲染总代或公司的总利润
  renderTotalProfit () {
    const { team } = this.props.statistic
    const { data } = this.props.statistic
    let totalProfit = 0
    if (data) {
      totalProfit += data.totalProfit
    }
    if (team) {
      team.map(item => {
        totalProfit += item.statistic.totalProfit
      })
    }
    const dataSource = [{ title: '总利润', desc: totalProfit }]
    return totalProfit > 0 ? <List className={styles.statistic_totalprofit} dataSource={dataSource} /> : null
  }

  componentDidMount () {
    this.getStatistic()
  }

  render () {
    const { startTime, endTime } = this.state
    return <div className={styles.statistic}>
    <div className={styles.statistic_condition}>
      <InputWithLabel label='开始时间' name='startTime' value={startTime} onChange={this.setSearchTime} type='date' />
      <InputWithLabel label='结束时间' name='endTime' value={endTime} onChange={this.setSearchTime} type='date' />
    </div>
    {this.renderTotalProfit()}
    {this.renderStatistic()}
    {this.renderMembers()}
    {this.renderTeamItem()}
    </div>
  }
}

const mapStateToProps = ({ statistic }) => {
  return { statistic }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(statisticActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatisticComponent)