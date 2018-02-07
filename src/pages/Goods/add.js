import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import InputWithLabel from 'Gb/components/InputWithLabel'
import SelectWithLabel from 'Gb/components/SelectWithLabel'
import { Cell, CellHeader, CellBody, CellFooter, Button } from 'react-weui'
import goodsActions from './actions'

import styles from './index.scss'

class GoodsAdd extends Component {
  constructor () {
    super()
    this.state = {}
    this.filterCategory = this.filterCategory.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.uploadImg = this.uploadImg.bind(this)
    this.addGoods = this.addGoods.bind(this)
  }

  handleChange (e) {
    const { name, value } = e.target
    this.props.actions.handleChange({name, value})
  }

  uploadImg () {
    const file = this.fileNode.files[0]
    if (file) {
      this.props.actions.uploadImg(file)
    }
  }

  addGoods () {
    this.props.actions.addGoods()
  }

  filterCategory () {
    const { categoryList = [] } = this.props.goods
    return categoryList.map(item => {
      return {
        label: item.name,
        value: item._id
      }
    })
  }

  componentDidMount () {
    this.props.actions.fetchCategory()
  }

  render () {
    const { name, bprice, zprice, tprice, lprice, apply, category, image } = this.props.goods.add
    return <div className={styles.goodsadd}>
      <InputWithLabel value={name} name='name' onChange={this.handleChange} label='商品名称' maxLength='16' />
      <InputWithLabel value={bprice} name='bprice' onChange={this.handleChange} label='进价' type='number' maxLength='10' />
      <InputWithLabel value={zprice} name='zprice' onChange={this.handleChange} label='总代价' type='number' maxLength='10' />
      <InputWithLabel value={tprice} name='tprice' onChange={this.handleChange} label='特代价' type='number' maxLength='10' />
      <InputWithLabel value={lprice} name='lprice' onChange={this.handleChange} label='零售价' type='number' maxLength='10' />
      <InputWithLabel value={apply} name='apply' onChange={this.handleChange} label='供应商' max='20' />
      <SelectWithLabel value={category} name='category' options={this.filterCategory()} onChange={this.handleChange} label='商品分类' />
      <Cell>
        <CellHeader>
          上传商品图
        </CellHeader>
        <CellBody className={styles.goodsadd_upload}>
          <div className='weui-uploader__input-box'>
            <input ref={(node) => {this.fileNode = node}} className='weui-uploader__input' type="file" capture onChange={this.uploadImg} accept='image/*'/>
          </div>
        </CellBody>
        <CellFooter>
          { image && <img className={styles.goodsadd_upload_img} src={image} alt='upload' /> }
        </CellFooter>
      </Cell>
      <div className={styles.goodsadd_btn}>
        <Button onClick={this.addGoods}>提交</Button>
      </div>
      
      
    </div>
  }
}

const mapStateToProps = ({ goods }) => {
  return { goods }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(goodsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodsAdd)
