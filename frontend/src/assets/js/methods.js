import $ from "jquery";
import _ from "lodash";
import Filter from "./treeFilter";
import { Data, Grid } from "slickgrid-es6";

export default {
  /**
   * Performs initial underlying setup/rendering of the grid.
   */
  init() {
    this.fireSlimGridEvent("onBeforeInit", {});
    this.createDataView();
    this.generateColumns();
    this.generateFilters();
    this.createSlickGrid();
    this.registerPlugins();
    this.registerEvents();
    this.treeViewCollapseBehaivor()

    this.slickGrid.init();

    this.rendered = true;
    this.fireSlimGridEvent("onDataViewUpdate", {});
    this.fireSlimGridEvent("onAfterInit", {});
  },

  /**
   * Performs update methods required when setting new/updated data for the grid.
   */
  setData() {
    this.fireSlimGridEvent("onBeforeDataUpdate", {});

    this.generateColumns();
    this.generateFilters();
    this.setOptions();

    this.dataView.beginUpdate();
    this.setDataViewData();
    this.dataView.endUpdate();

    this.fireSlimGridEvent("onDataViewUpdate", {});
    this.fireSlimGridEvent("onAfterDataUpdate", {});
  },

  /**
   * Sets slickgrid options updating values if any have changed.
   */
  setOptions() {
    this.slickGrid.setOptions(this.slickGridOptions);
    this.slickGrid.invalidate();
  },

  /**
   * Destroys the underlying SlickGrid if it exists.
   */
  destroy() {
    if (!this.slickGrid) return;

    this.slickGrid.destroy();
  },

  /**
   * Creates columns for the grid, with options applied.
   */
  generateColumns() {
    this.columns = _(this.getColumns())
      .map(this.getColumnOptions)
      .filter(
        o => {
          return _.isFunction(o.hidden) ? !o.hidden(o) : !o.hidden;
        }
      )
      .sortBy([
        o => {
          return _.isFunction(o.order) ? o.order(o) : o.order;
        }
      ])
      .value();

    this.fireSlimGridEvent("onColumnsGenerated", {});
  },

  /**
   * ...
   */
  generateFilters() {
    this.filters = _(this.columns)
      .keyBy("id")
      .mapValues(() => "")
      .assign(
        _.pick(this.filters, _(this.columns).keyBy("id").keys().value())
      )
      .value();

    this.fireSlimGridEvent("onFiltersGenerated", {});
  },

  /**
   * ...
   */
  createDataView() {
    let provider = this.plugins.groupItemMetaDataProvider.plugin;
    this.dataView = new Data.DataView({ groupItemMetadataProvider: provider});

    this.dataView.getItemMetadata = row => {
      let item = this.dataView.getItem(row);
      if (item === undefined) {
        return null;
      }

      // Overrides for grouping rows.
      if (item.__group) {
        return provider.getGroupRowMetadata(item);
      }

      // Overrides for grouping total rows.
      if (item.__groupTotals) {
        return provider.getTotalsRowMetadata(item);
      }

      return this.rowFormatter(item);
    };

    this.dataView.beginUpdate();
    this.setDataViewData();
    this.setDataViewFilter();
    this.dataView.endUpdate();

    // Set row grouping if there's any that need to happen.
    this.setDataViewGrouping(this.grouping);
  },

  /**
   * Creates the underlying SlickGrid instance and sets the selection model.
   */
  createSlickGrid() {
    this.slickGrid = new Grid(
      this.$refs.grid,
      this.dataView,
      this.columns,
      this.slickGridOptions
    );
    this.setSelectionModel();
    this.slickGrid.getCanvasNode().focus();
  },

  /**
   * Register Grid, DataView, Selection Model, and Plugin events.
   */
  registerEvents() {
    const gridEvents = [
      // Register Grid Events.
      {
        handler: this.slickGrid,
        events: this.events.slickGrid
      },

      // Register DataView Events.
      {
        handler: this.dataView,
        events: this.events.dataView
      },

      // Register SelectionModel Events.
      {
        handler: this.selectionModel,
        events: this.events.selectionModel
      }
    ];

    // Register any plugin events.
    const pluginEvents = _(this.plugins)
      .pickBy(plugin => {
        return plugin.hasOwnProperty("events");
      })
      .map(plugin => {
        return { handler: plugin.plugin, events: plugin.events };
      })
      .value();

    _.forEach(_.concat(gridEvents, pluginEvents), registee => this.handleEventRegistration(registee));

    this.registerHeaderInputEvent();
  },

  /**
   * Register plugins with the SlickGrid instance.
   */
  registerPlugins() {
    _(this.plugins)
      .pickBy(plugin => {
        return plugin.register;
      })
      .forEach(plugin => {
        this.slickGrid.registerPlugin(plugin.plugin);
      });
  },

  /**
   * ...
   */
  handleEventRegistration(registee) {
    _.forEach(registee.events, (callbacks, event) => {
      if (this.cachedEvents.hasOwnProperty(event)) {
        registee.handler[event].unsubscribe(this.cachedEvents[event]);
      }

      this.cachedEvents[event] = (e, args) => {
        let params = callbacks.hasOwnProperty("before")
          ? callbacks.before.call(this, e, args)
          : null;
        if (params) {
          args["slim"] = params;
        }

        callbacks.on.call(this, e, args);

        if (callbacks.hasOwnProperty("after")) {
          callbacks.after.call(this, e, args);
        }
      };

      registee.handler[event].subscribe(this.cachedEvents[event]);
    });
  },

  /**
   * ...
   */
  registerHeaderInputEvent() {
    let $vm = this;
    $($vm.slickGrid.getHeaderRow()).delegate(":input", "change keyup", function() {
      const columnId = $(this).data("columnId");

      if (!columnId) return;

      let value = $.trim($(this).val());
      if (!$vm.filters.hasOwnProperty(columnId)) {
        $vm.$set($vm.filters, columnId, value);
      }

      $vm.filters[columnId] = value;
    });
  },

  /**
   * Calculates the statistics of multiple SlickGrid ranges and updates pagerStats data.
   */
  calculatePagerStats(ranges) {
    // Map SlickGrid ranges to array of cell values.
    const cellValues = this.getCellValuesFromRanges(ranges);

    // Only include numerical values in our statistics.
    const numberValues = _.filter(cellValues, _.isNumber);

    const count =
      this.selectionModel.constructor.name === "RowSelectionModel"
        ? this.slickGrid.getSelectedRows().length
        : cellValues.length;

    this.pagerStats = {
      avg: numberValues.length > 0 ? _.round(_.mean(numberValues), 4) : 0,
      count: count,
      min: numberValues.length > 0 ? _.min(numberValues) : 0,
      max: numberValues.length > 0 ? _.max(numberValues) : 0,
      sum: _.round(_.sum(numberValues), 4)
    };
  },

  /**
   * Performed when the SlimGrid context menu is selected via click.
   */
  contextMenuOptionSelected(e, option) {
    this.fireSlimGridEvent("onContextMenuOptionClick", {
      e,
      option,
      selectedRows: this.getSelectedRows()
    });
  },

  /**
   * Fires a SlimGrid related event by name with the provides arguments.
   */
  fireSlimGridEvent(event, args) {
    const slimGridEvents = this.events.slimGrid;
    if (!slimGridEvents.hasOwnProperty(event)) return;

    let params = slimGridEvents[event].hasOwnProperty("before")
      ? slimGridEvents[event].before.call(this, args)
      : null;
    if (params) {
      args["slim"] = params;
    }
    args["grid"] = this.slickGrid;

    slimGridEvents[event].on.call(this, args);

    if (slimGridEvents[event].hasOwnProperty("after")) {
      slimGridEvents[event].after.call(this, args);
    }
  },

  /**
   * Sets data into the DataView instance.
   */
  setDataViewData() {
    if (!this.dataView) return;
    // if (this.treeFilter && !this.treeStartExpanded) {
    //   this.data = this.data.map(c => {
    //     return {...c, '_collapsed': true}
    //   })
    // }
    this.dataView.setItems(this.data, this.pk);
  },

  /**
   * Sets the main filter into the DataView instance.
   */
  setDataViewFilter() {
    if (!this.dataView) return;
    if (!Filter) return;

    if (this.filter) {
      this.dataView.setFilter(this.filter.bind(this))
    } else {
      this.dataView.setFilter(Filter.bind(this));
    }
  },

  /**
   * Sets the data grouping into the DataView instance.
   */
  setDataViewGrouping(grouping) {
    if (!this.dataView) return;

    this.dataView.setGrouping(grouping);
  },

  /**
   * Refreshes the DataView when filters are changed.
   */
  setFilters: _.debounce(function() {
    if (!this.dataView) return;

    this.dataView.refresh();
    this.fireSlimGridEvent("onDataViewUpdate", {});
  }, 300),

  /**
   * Sets the selection model onto the SlickGrid instance.
   */
  setSelectionModel() {
    if (!this.slickGrid) return;

    this.registerEvents();

    this.slickGrid.setSelectionModel(this.selectionModel);
  },

  /**
   * Sets the provided column onto the SlickGrid instance.
   */
  setColumns() {
    if (!this.slickGrid) return;

    this.slickGrid.setColumns(this.columns);
    this.fireSlimGridEvent("onColumnsSet", { columns: this.columns });
  },

  /**
   * Returns an array of the columns to use on the grid.
   */
  getColumns() {
    if (this.explicitColumns.length) {
      return this.explicitColumns;
    }

    if (this.data.length) {
      return _.keys(this.data[0]);
    }

    return [];
  },

  /**
   * Returns a transformed array of the currently selected rows in the grid.
   */
  getSelectedRows() {
    if (!this.slickGrid) return [];

    return _(this.slickGrid.getSelectedRows())
      .map(value => {
        return this.dataView.getItem(value);
      })
      .reverse()
      .value();
  },

  /**
   * Returns a transformed array of the currently selected rows in the grid using the provided ranges.
   */
  getSelectedRowsByRanges(ranges) {
    if (!this.slickGrid) return [];

    return _.map(_.range(ranges.fromRow, ranges.toRow + 1), v => {
      return this.slickGrid.getDataItem(v);
    });
  },

  /**
   * ...
   */
  getColumnOptions(column, idx) {
    // The default column options.
    const self = this

    const treeFormatter = function(row, cell, value, columnDef, dataContext) {
      const self2 = self
      if (value == null || value == undefined || dataContext === undefined) {
        return "";
      }

      value = value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      var spacer =
        "<span style='display:inline-block;height:1px;width:" +
        15 * dataContext["depth"] +
        "px'></span>";
      var idx = self2.dataView.getIdxById(dataContext.guid);
      if (self2.data[idx + 1] && self2.data[idx + 1].depth > self2.data[idx].depth) {
        if (dataContext._collapsed) {
          return spacer + " <span class='toggle expand material-icons'>add</span>&nbsp;" + value;
        } else {
          return (
            spacer + " <span class='toggle collapse material-icons'>remove</span>&nbsp;" + value
          );
        }
      } else {
        return spacer + " <span class='toggle'></span>&nbsp;" + value;
      }
    }

    let defaults = {
      order: idx,
      id: column,
      name: column,
      field: column,
      hidden: false,
      sortable: true,
      resizable: true,
      focusable: true,
      selectable: true,
      headerInput: true,
      headerFilter: true,
      headerCssClass: null,
      minWidth: 30,
      cssClass: "text-center",
      defaultSortAsc: true,
      groupTotalsFormatter() {
        return null;
      },
      formatter(row, cell, value) {
        return value;
      }
    };

    if (this.treeFilter && defaults.order == 0) {
      defaults.formatter = treeFormatter
    }

    // Merge existing column settings (since width can change with resize, etc.)
    this.mergeExistingColumnSettings(defaults, column);

    // Hide primary key column by default.
    if (column === this.pk) {
      defaults.order = -1;
      defaults.hidden = true;
    }

    // Override default column options with options under 'all' if provided.
    if (this.columnOptions.hasOwnProperty("*")) {
      _.merge(defaults, this.columnOptions["*"]);
    }
    // Override specific default column options with user preferences (takes precedence over 'all' option).
    if (this.columnOptions.hasOwnProperty(column)) {
      let {...colOpts} = this.columnOptions[column]
      _.merge(defaults, colOpts);
    }
    return _.mapValues(defaults, (value, key) => {
      return _.isFunction(value) && ["groupTotalsFormatter", "formatter", "hidden", "order", "editor"].indexOf(key) === -1 ? value(defaults) : value;
    });
  },

  /**
   * ...
   */
  mergeExistingColumnSettings(defaults, column) {
    if (!this.slickGrid) return;

    const existingColumns = _(this.slickGrid.getColumns())
      .keyBy("id")
      .value();

    if (!existingColumns.hasOwnProperty(column)) return;

    _.merge(defaults, existingColumns[column]);
  },

  /**
   * ...
   */
  getCellValuesFromRanges(ranges) {
    const columns = this.slickGrid.getColumns();

    return _(ranges)
      .flatMap(range => {
        return _(_.range(range.fromRow, range.toRow + 1))
          .map(rowIdx => {
            return this.slickGrid.getDataItem(rowIdx);
          })
          .map(row => {
            return _(_.range(range.fromCell, range.toCell + 1))
              .map(cellIdx => {
                return row[columns[cellIdx].field];
              })
              .value();
          })
          .value();
      })
      .flatten()
      .value();
  },

  /**
   * Performs resizing of the grid to match its container.
   */
  handleResize() {
    if (!this.slickGrid) {
      return
    };
    this.slickGrid.invalidate()
    this.slickGrid.resizeCanvas()
  },

  treeViewCollapseBehaivor() {
    const self = this
    if (this.treeFilter) {
      this.slickGrid.onClick.subscribe(function (e, args) {
        if ($(e.target).hasClass("toggle")) {
          var item = self.dataView.getItem(args.row);
          if (item) {
            if (!item._collapsed) {
              item._collapsed = true;
            } else {
              item._collapsed = false;
            }
            self.dataView.updateItem(item.guid, item);
          }
          e.stopImmediatePropagation();
        }
      });
    }
  },
  delayedResize() {
    setTimeout(this.handleResize,1500)
  }
};
