import { Component, ViewChild, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { IgxInputDirective, IgxListComponent, IgxOverlayOutletDirective, OverlaySettings, IgxFilterOptions } from '@infragistics/igniteui-angular';
import { TasksDataService } from '../services/tasks.service';
import { ITask } from '../interfaces';

export interface IListItemAction {
    action: string;
    issue: ITask;
}

@Component({
    selector: 'app-backlog',
    templateUrl: './backlog.component.html',
    styleUrls: ['./backlog.component.scss'],
})
export class BacklogComponent implements OnInit  {
    public tasks: ITask[];
    public dropTileId: number;
    public taskSearchString: string;
    public overlaySettings: OverlaySettings = {
        modal: false,
        closeOnOutsideClick: true
    };

    @ViewChild('taskSearch', { read: IgxInputDirective, static: true }) public searchInput: IgxInputDirective;
    @ViewChild(IgxListComponent, { read: IgxListComponent, static: true }) public tasksList: IgxListComponent;
    @ViewChild(IgxOverlayOutletDirective, { static: true }) public outlet: IgxOverlayOutletDirective;

    @Output() listItemAction = new EventEmitter<IListItemAction>();

    @Input()
    public set data(data: ITask[]) {
        this.tasks = data;
    }

    constructor(private dataService: TasksDataService) {}

    public ngOnInit() {
        this.overlaySettings.outlet = this.outlet;
    }

    public clearSearchInput() {
        this.searchInput.value = '';
    }

    public onActionTriggered(action: string, issue: ITask) {
        const eventArgs: IListItemAction = { action, issue };
        this.listItemAction.emit(eventArgs);
    }

    public deleteItem(issue: ITask, index?: number) {
        index = index ? index : this.tasks.findIndex(rec => rec.id === issue.id);
        this.tasks.splice(index, 1);
    }

    public get filterTasks() {
        const fo = new IgxFilterOptions();
        fo.key = 'title';
        fo.inputValue = this.taskSearchString;
        return fo;
    }

    public getPriority(value: ITask) {
        const label = value.labels.filter(l => l.name.indexOf('severity:') === 0);
        if (label.length) {
            return label[0].name.substring(10).toLowerCase();
        } else {
            return 'low';
        }
    }
}
